// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarketIndexCard from '@/components/MarketSentimentCard';
import MarketStockCard from '@/components/IndexCard';
import NewsDashboard from '@/components/NewsDashboard';
import StockTable from '@/components/StockTable';
import { MarketSentiment, MarketIndexService } from '@/lib/MarketSentiment';

// Simplified interface for navigation - only need symbol
export interface StockDataForNavigation {
  symbol: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [marketData, setMarketData] = useState<MarketSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const data = await MarketIndexService.getMarketSentiment();
        setMarketData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market sentiment data');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Simplified function to handle stock click - only passes symbol
  const handleStockClick = (stockData: StockDataForNavigation) => {
    router.push(`/stock/${stockData.symbol}`);
  };

  // Static data for stock cards - replace with API data later
  const stockData = [
    {
      name: "NIFTY 50",
      currentValue: 19834.50,
      change: 152.40,
      changePercentage: 0.77
    },
    {
      name: "SENSEX",
      currentValue: 66588.93,
      change: 361.75,
      changePercentage: 0.55
    }
  ];

  return (
    <div className="min-h-screen text-white p-2" style={{ backgroundColor: 'var(--background)' }}>
      
      {/* Market Index Section */}
      <section className="mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Parent container for gauge meters and stock cards */}
          <div className="flex-1">
            <div className="flex gap-4">
              
              {/* Left child - Gauge meters (3/4 width) */}
              <div className="flex-grow">
                {loading && (
                  <div className="flex justify-start items-center py-8">
                    <div className="text-lg text-gray-400">Loading market data...</div>
                  </div>
                )}
                
                {error && (
                  <div className="flex justify-start items-center py-8">
                    <div className="text-lg text-red-400">{error}</div>
                  </div>
                )}
                
                {!loading && !error && (
                  <div className="flex flex-wrap gap-4 justify-start">
                    {marketData.map((sentiment) => (
                      <div key={sentiment.id} className="w-full sm:w-64 flex-shrink-0">
                        <MarketIndexCard
                          source={sentiment.source}
                          score={sentiment.score}
                          lastUpdated={sentiment.last_updated}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {!loading && !error && marketData.length === 0 && (
                  <div className="flex justify-start items-center py-8">
                    <div className="text-lg text-gray-400">No market data available</div>
                  </div>
                )}
              </div>
              
              {/* Right child - Stock cards (1/4 width) stacked vertically */}
              <div className="w-48 flex flex-col gap-4 h-full">
                {stockData.map((stock) => (
                  <div key={stock.name} className="flex-1">
                    <MarketStockCard
                      name={stock.name}
                      currentValue={stock.currentValue}
                      change={stock.change}
                      changePercentage={stock.changePercentage}
                    />
                  </div>
                ))}
              </div>
              
            </div>
            {/* Stock Table - positioned between gauge meters and news */}
            <div className="w-full mt-6">
              <StockTable className="w-full" onStockClick={handleStockClick} />
            </div>
          </div>
          
          {/* News Dashboard */}
          <div className="w-full lg:w-80 xl:w-96">
            <NewsDashboard />
          </div>
          
        </div>
      </section>
    </div>
  );
}