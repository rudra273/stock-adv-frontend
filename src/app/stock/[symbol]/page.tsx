
// src/app/stock/[symbol]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import StockHeader from '@/components/Stock/StockHeader';
import StockGraph from '@/components/Stock/StockGraph';
import { CurrentPrice, CurrentPriceService } from '@/lib/current_price';


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
        
        // Fallback to mock data if API fails
        const mockStockData: CurrentPrice = {
          symbol: symbol,
          companyName: symbol === 'TCS.NS' ? 'Tata Consultancy Services' : 'Company Name',
          currentPrice: 3765.71,
          previousClose: 3720.56,
          Change: 45.15,
          PercentChange: 1.23
        };
        setStockData(mockStockData);
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
    <div className="min-h-screen text-white p-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <StockHeader
          symbol={stockData.symbol}
          companyName={stockData.companyName}
          currentPrice={stockData.currentPrice}
          priceChange={stockData.Change}
          percentageChange={stockData.PercentChange}
        />
        
        <StockGraph symbol={symbol} />
      </div>
    </div>
  );
}