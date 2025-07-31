// src/components/Stock/StockHeader.tsx
'use client';

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';

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

  // Add local state for bookmark
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex justify-between items-start mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
      <div>
        <h1 className="text-lg font-bold text-white mb-1">
          {companyName.charAt(0).toUpperCase() + companyName.slice(1).toLowerCase()}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">
            ₹{currentPrice.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-base font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}
            </span>
            <span className={`text-base font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              ({isPositive ? '+' : ''}{percentageChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <button
        aria-label="Bookmark"
        className="transition-colors"
        onClick={() => setBookmarked((prev) => !prev)}
      >
        <Bookmark
          size={28}
          fill={bookmarked ? '#10b981' : 'none'}
          color={bookmarked ? '#10b981' : 'currentColor'}
        />
      </button>
    </div>
  );
}