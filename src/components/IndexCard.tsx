// // components/IndexCard.tsx
// 'use client';

// import React from 'react';

// interface MarketStockCardProps {
//   name: string;
//   currentValue: number;
//   change: number;
//   changePercentage: number;
// }

// export default function MarketStockCard({
//   name,
//   currentValue,
//   change,
//   changePercentage
// }: MarketStockCardProps) {
//   const isPositive = change >= 0;
    
//   return (
//     <div 
//       className="rounded-lg p-4 border flex flex-col justify-center"
//       style={{
//         backgroundColor: 'var(--background)',
//         borderColor: 'var(--border-color)',
//         height: '83px' // Fixed height to match MarketIndexCard
//       }}
//     >
//       {/* Stock Name and Current Value in one line */}
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-sm font-medium text-gray-400">
//           {name}
//         </span>
//         <span className="text-lg font-bold text-white">
//           {currentValue.toLocaleString('en-IN')}
//         </span>
//       </div>
            
//       {/* Change and Percentage */}
//       <div className="flex items-center gap-2">
//         <span 
//           className={`text-sm font-medium ${
//             isPositive ? 'text-green-400' : 'text-red-400'
//           }`}
//         >
//           {isPositive ? '+' : ''}{change.toFixed(2)}
//         </span>
//         <span 
//           className={`text-sm font-medium ${
//             isPositive ? 'text-green-400' : 'text-red-400'
//           }`}
//         >
//           ({isPositive ? '+' : ''}{changePercentage.toFixed(2)}%)
//         </span>
//       </div>
//     </div>
//   );
// }
// components/MarketStockCard.tsx
'use client';

import React from 'react';

// A small, self-contained component for the change indicator icon.
const ChangeArrow: React.FC<{ isPositive: boolean }> = ({ isPositive }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isPositive ? 'rotate(0deg)' : 'rotate(180deg)' }}
  >
    <path d="M12 4L19 11H5L12 4Z" />
  </svg>
);


interface MarketStockCardProps {
  name: string;
  currentValue: number;
  change: number;
  changePercentage: number;
}

export default function MarketStockCard({
  name,
  currentValue,
  change,
  changePercentage
}: MarketStockCardProps) {
  const isPositive = change >= 0;
  const changeColorClass = isPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]';

  return (
    // NEW LAYOUT: The main container is now a column flexbox
    <div
      className="rounded-xl p-4 border bg-[var(--background)] flex flex-col justify-between transition-all duration-200 ease-in-out hover:shadow-lg hover:border-[var(--color-positive)]/50 hover:-translate-y-1"
      style={{
        borderColor: 'var(--border-color)',
        height: '96px' // A spacious height for the new layout
      }}
    >
      {/* --- TOP ROW: Stock Name --- */}
      <div>
        <span className="text-base font-semibold text-[var(--foreground)]">
          {name}
        </span>
      </div>

      {/* --- BOTTOM ROW: Price vs. Change --- */}
      <div className="flex justify-between items-end">
        {/* Left Side: Current Value */}
        <div>
          <span className="text-sm font-bold text-[var(--foreground)]">
            {'₹'}
            {currentValue.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Right Side: Change Details */}
        <div className={`flex items-center gap-2 ${changeColorClass}`}>
            <ChangeArrow isPositive={isPositive} />
            <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                    {isPositive ? '+' : ''}{change.toFixed(2)}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">
                    ({isPositive ? '+' : ''}{changePercentage.toFixed(2)}%)
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}