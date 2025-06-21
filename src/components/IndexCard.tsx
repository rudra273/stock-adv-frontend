// components/MarketStockCard.tsx
'use client';

import React from 'react';

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
    
  return (
    <div 
      className="rounded-lg p-4 border flex flex-col justify-center"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border-color)',
        height: '83px' // Fixed height to match MarketIndexCard
      }}
    >
      {/* Stock Name and Current Value in one line */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-400">
          {name}
        </span>
        <span className="text-lg font-bold text-white">
          {currentValue.toLocaleString('en-IN')}
        </span>
      </div>
            
      {/* Change and Percentage */}
      <div className="flex items-center gap-2">
        <span 
          className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isPositive ? '+' : ''}{change.toFixed(2)}
        </span>
        <span 
          className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
        >
          ({isPositive ? '+' : ''}{changePercentage.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}