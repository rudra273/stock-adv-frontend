// components/MarketIndexCard.tsx

import React from 'react';

// Define the props for the component
interface MarketIndexCardProps {
  source: string;
  score: number;
  lastUpdated: string;
}

// --- Helper Functions ---

/**
 * Converts a score (0-100) to SVG coordinates on a semi-circle.
 * @param score - The input score (0-100).
 * @param radius - The radius of the arc.
 * @param center - The [x, y] coordinates of the SVG center.
 * @returns [x, y] coordinates.
 */
const getCoordsOnArc = (score: number, radius: number, center: [number, number]): [number, number] => {
  const angle = (score / 100) * 180 - 180;
  const angleRad = (angle * Math.PI) / 180;
  const x = center[0] + radius * Math.cos(angleRad);
  const y = center[1] + radius * Math.sin(angleRad);
  return [x, y];
};

/**
 * Returns sentiment rating and color based on the score.
 * @param score - The market sentiment score.
 * @returns An object with the rating string and its corresponding color.
 */
const getRatingInfo = (score: number): { rating: string; color: string } => {
  if (score <= 25) return { rating: 'Extreme Fear', color: '#ef4444' };
  if (score <= 44) return { rating: 'Fear', color: '#f97316' };
  if (score <= 55) return { rating: 'Neutral', color: '#eab308' };
  if (score <= 75) return { rating: 'Greed', color: '#10b981' };
  return { rating: 'Extreme Greed', color: '#16a34a' };
};


// --- Sub-components for SVG rendering ---

const GaugeArc: React.FC<{ start: number; end: number; color: string; radius: number; center: [number, number] }> = ({ start, end, color, radius, center }) => {
  const [startX, startY] = getCoordsOnArc(start, radius, center);
  const [endX, endY] = getCoordsOnArc(end, radius, center);
  const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  return <path d={pathData} fill="none" stroke={color} strokeWidth="20" strokeLinecap="round" />;
};

// --- Main Component ---

const MarketIndexCard: React.FC<MarketIndexCardProps> = ({ source, score, lastUpdated }) => {
  const svgCenter: [number, number] = [160, 140];
  const gaugeRadius = 100;
  const needleAngle = (score / 100) * 180 - 90;
  const { rating, color: scoreColor } = getRatingInfo(score);

  const gaugeSections = [
    { name: 'EXTREME FEAR', start: 0, end: 25, color: '#ef4444' },
    { name: 'FEAR', start: 25.5, end: 44, color: '#f97316' },
    { name: 'NEUTRAL', start: 44.5, end: 55, color: '#eab308' },
    { name: 'GREED', start: 55.5, end: 75, color: '#10b981' },
    { name: 'EXTREME GREED', start: 75.5, end: 100, color: '#16a34a' },
  ];
  
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="bg-[var(--sidebar-bg)] rounded-xl p-2 shadow-xl border border-[var(--border-color)] w-full max-w-sm font-sans">
      {/* UPDATED: Heading is now smaller and lighter */}
      <h2 className="text-sm font-semibold text-center text-[var(--foreground)] tracking-wide">{source}</h2>
      
      <div className="relative w-full aspect-[1.8/1] mx-auto mt-2">
        <svg className="w-full h-full" viewBox="0 0 320 160">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.2" />
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
               <feGaussianBlur stdDeviation="8" result="coloredBlur" in="SourceGraphic" />
               <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
               </feMerge>
            </filter>
          </defs>

          <g>
            {gaugeSections.map(section => (
              <GaugeArc 
                key={section.name} 
                start={section.start} 
                end={section.end} 
                color={section.color}
                radius={gaugeRadius}
                center={svgCenter}
              />
            ))}
          </g>

          <g fill="#a0aec0" fontSize="12" fontWeight="medium" textAnchor="middle">
            {ticks.map(tick => {
              const [x, y] = getCoordsOnArc(tick, gaugeRadius + 22, svgCenter);
              return <text key={tick} x={x} y={y + 5}>{tick}</text>
            })}
          </g>

          <g transform={`translate(${svgCenter[0]}, ${svgCenter[1]})`}>
            <circle cx="0" cy="0" r="45" fill={scoreColor} filter="url(#glow)" opacity="0.3" />
            <circle cx="0" cy="0" r="50" fill="var(--sidebar-bg)" stroke="var(--border-color)" strokeWidth="1" />
            <text x="0" y="-8" fill="var(--foreground)" fontSize="28" fontWeight="bold" textAnchor="middle">
              {score}
            </text>
            <text x="0" y="18" fill={scoreColor} fontSize="14" fontWeight="bold" textAnchor="middle" className="uppercase tracking-wider">
              {rating}
            </text>
          </g>

          <g transform={`rotate(${needleAngle} ${svgCenter[0]} ${svgCenter[1]})`} style={{ transition: 'transform 0.5s ease-out' }}>
            <path 
              d={`M ${svgCenter[0]} ${svgCenter[1] - gaugeRadius + 5} L ${svgCenter[0]} ${svgCenter[1] - 15}`} 
              stroke="var(--foreground)" 
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#shadow)"
            />
            {/* UPDATED: This is the "dot" or pivot hub. You can delete the line below for a cleaner look. */}
            {/* <circle cx={svgCenter[0]} cy={svgCenter[1]} r="6" fill="var(--foreground)" stroke="#4a5568" strokeWidth="2" /> */}
          </g>
        </svg>
      </div>
     
      <p className="text-xs text-gray-500 text-center mt-2">
        Last Updated: {lastUpdated}
      </p>
    </div>
  );
};

export default MarketIndexCard;