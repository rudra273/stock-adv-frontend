// src/app/stock/[symbol]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import StockHeader from '@/components/Stock/StockHeader';
import StockGraph from '@/components/Stock/StockGraph';
import ActionButton from '@/components/UI/ActionButton';
import { CurrentPrice, CurrentPriceService } from '@/lib/current_price';
import NewsDashboard from '@/components/NewsDashboard';
import FinancialsSection from '@/components/Stock/FinancialsSection';

export default function StockPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [stockData, setStockData] = useState<CurrentPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CurrentPriceService.getCurrentPriceForSymbol(symbol);
        setStockData(data);
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen text-white p-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">Loading stock data...</div>
      </div>
    );
  }

  if (error && !stockData) {
    return (
      <div className="min-h-screen text-white p-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="min-h-screen text-white p-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">No stock data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-2" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Stock details */}
          <div className="flex-1">
            
            <div className="mb-8">
              <StockHeader
                symbol={stockData.symbol}
                companyName={stockData.companyName}
                currentPrice={stockData.currentPrice}
                priceChange={stockData.Change}
                percentageChange={stockData.PercentChange}
              />
            </div>
            
            <div className="mb-6">
              <StockGraph symbol={stockData.symbol} />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <ActionButton 
                variant="primary"
                href="/technical-analysis"
                symbol={symbol}
              >
                Run Technical Analysis
              </ActionButton>
              <ActionButton 
                variant="secondary"
                href="/research"
                symbol={symbol}
              >
                Run News Research
              </ActionButton>
            </div>
            <FinancialsSection symbol={symbol} />
          </div>
          
          {/* Right: News Dashboard */}
          <div className="w-full lg:w-80 xl:w-96">
            <NewsDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}