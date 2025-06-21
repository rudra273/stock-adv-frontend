// src/components/Stock/StockHeader.tsx
'use client';

import React from 'react';

interface StockHeaderProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  percentageChange: number;
}

export default function StockHeader({ 
  symbol, 
  companyName, 
  currentPrice, 
  priceChange, 
  percentageChange 
}: StockHeaderProps) {
  const isPositive = priceChange >= 0;

  return (
    <div className="flex justify-between items-start mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--border-color)' }}>
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {companyName} ({symbol})
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-white">
            ${currentPrice.toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}
            </span>
            <span className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              ({isPositive ? '+' : ''}{percentageChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <button 
        className="px-4 py-2 rounded-lg font-medium transition-colors"
        style={{ 
          backgroundColor: 'var(--accent-green)', 
          color: 'white',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        Add to Watchlist
      </button>
    </div>
  );
}