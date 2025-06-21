// components/MarketIndexCard.tsx

import React from 'react';

interface MarketSentimentProps {
  source: string;
  score: number;
  lastUpdated: string;
}

// Helper function to convert a score (0-100) into SVG coordinates on a top semi-circle arc.
const getCoordsOnArc = (score: number, radius: number, center: [number, number]): [number, number] => {
  const angle = (score / 100) * 180 - 180;
  const angleRad = (angle * Math.PI) / 180;
  const x = center[0] + radius * Math.cos(angleRad);
  const y = center[1] + radius * Math.sin(angleRad);
  return [x, y];
};

// A small component to create the arc paths dynamically.
const Arc: React.FC<{ startScore: number; endScore: number; color: string }> = ({ startScore, endScore, color }) => {
  const arcRadius = 110;
  const arcCenter: [number, number] = [160, 130];

  const [startX, startY] = getCoordsOnArc(startScore, arcRadius, arcCenter);
  const [endX, endY] = getCoordsOnArc(endScore, arcRadius, arcCenter);

  const pathData = `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 1 ${endX} ${endY}`;
  return <path d={pathData} fill="none" stroke={color} strokeWidth="12" />;
};

const MarketIndexCard: React.FC<MarketSentimentProps> = ({
  source,
  score,
  lastUpdated
}) => {
  const needleAngle = (score / 100) * 180 - 90;

  const getRatingInfo = (currentScore: number): { rating: string; color: string } => {
    if (currentScore <= 25) return { rating: 'EXTREME FEAR', color: '#ef4444' };
    if (currentScore <= 44) return { rating: 'FEAR', color: '#f97316' };
    if (currentScore <= 55) return { rating: 'NEUTRAL', color: '#eab308' };
    if (currentScore <= 75) return { rating: 'GREED', color: 'var(--accent-green)' };
    return { rating: 'EXTREME GREED', color: '#16a34a' };
  };

  const { rating, color: scoreColor } = getRatingInfo(score);

  const gaugeSections = [
    { name: 'EXTREME FEAR', start: 0, end: 25, color: '#ef4444' },
    { name: 'FEAR', start: 25, end: 44, color: '#f97316' },
    { name: 'NEUTRAL', start: 44, end: 55, color: '#eab308' },
    { name: 'GREED', start: 55, end: 75, color: 'var(--accent-green)' },
    { name: 'EXTREME GREED', start: 75, end: 100, color: '#16a34a' },
  ];
  const ticks = [0, 25, 50, 75, 100];

  // Center point for all SVG calculations
  const svgCenter: [number, number] = [160, 130];

  return (
    <div className="bg-[var(--sidebar-bg)] rounded-lg p-2 shadow-lg border border-[var(--border-color)] w-full max-w-sm">
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2 text-center">{source}</h3>
     
      {/* Gauge Container */}
      <div className="relative w-full aspect-[2/1] mx-auto">
        <svg className="w-full h-full" viewBox="0 0 320 145">
          {/* Background sections */}
          {gaugeSections.map(section => (
            <Arc key={section.name} startScore={section.start} endScore={section.end} color={section.color} />
          ))}

          {/* Scale numbers */}
          <g fill="#9ca3af" fontSize="12" fontWeight="bold" textAnchor="middle">
            {ticks.map(tick => {
              const [x, y] = getCoordsOnArc(tick, 125, svgCenter);
              return <text key={tick} x={x} y={y}>{tick}</text>
            })}
          </g>

          {/* Section labels */}
          <g fill="#9ca3af" fontSize="9" fontWeight="bold" textAnchor="middle">
            {gaugeSections.map(section => {
              const midScore = section.start + (section.end - section.start) / 2;
              const [x, y] = getCoordsOnArc(midScore, 90, svgCenter);
              const textRotationAngle = (midScore / 100) * 180 - 90;
              const parts = section.name.split(' ');
             
              return (
                <g key={section.name} transform={`translate(${x}, ${y}) rotate(${textRotationAngle})`}>
                  <text y={parts.length > 1 ? -2 : 0}>{parts[0]}</text>
                  {parts.length > 1 && <text y="8">{parts[1]}</text>}
                </g>
              );
            })}
          </g>

          {/* Needle with updated design - placed before semicircle for z-index */}
          <g transform={`rotate(${needleAngle} ${svgCenter[0]} ${svgCenter[1]})`}>
            <path 
              d={`M ${svgCenter[0]} 50 L ${svgCenter[0]+5} ${svgCenter[1]-25} L ${svgCenter[0]-5} ${svgCenter[1]-25} Z`} 
              fill="var(--foreground)"
            />
          </g>

          {/* Score Display Semicircle Background - smaller size */}
          <path 
            d={`M 130 130 A 30 30 0 0 1 190 130 Z`} 
            fill={scoreColor}
          />
          
          {/* Score Text inside the semicircle */}
          <text 
            x={svgCenter[0]} 
            y={svgCenter[1] - 10} 
            fill="#000" 
            fontSize="16" 
            fontWeight="bold" 
            textAnchor="middle" 
            dominantBaseline="middle"
          >
            {score}
          </text>

          {/* Rating Text - positioned below the gauge inside SVG */}
          <text 
            x={svgCenter[0]} 
            y={svgCenter[1] + 15} 
            fill={scoreColor}
            fontSize="14" 
            fontWeight="bold" 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="uppercase tracking-wide"
          >
            {rating}
          </text>
        </svg>
      </div>
     
      {/* Last Updated */}
      <div className="text-xs text-gray-400 text-center">
        {lastUpdated}
      </div>
    </div>
  );
};

export default MarketIndexCard;