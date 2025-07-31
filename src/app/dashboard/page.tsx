// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarketIndexCard from '@/components/MarketSentimentCard';
import MarketStockCard from '@/components/IndexCard';
import NewsDashboard from '@/components/NewsDashboard';
import StockTable from '@/components/StockTable';
import TopMovers from '@/components/TopMovers';
import { MarketSentiment, MarketIndexService } from '@/lib/MarketSentiment';
import { IndexInfo, IndexInfoService } from '@/lib/IndexInfo';

// Simplified interface for navigation - only need symbol
export interface StockDataForNavigation {
  symbol: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [marketData, setMarketData] = useState<MarketSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexData, setIndexData] = useState<IndexInfo[]>([]);
  const [indexLoading, setIndexLoading] = useState(true);
  const [indexError, setIndexError] = useState<string | null>(null);

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

    const fetchIndexData = async () => {
      try {
        setIndexLoading(true);
        const data = await IndexInfoService.getIndexInfo();
        setIndexData(data);
        setIndexError(null);
      } catch (err) {
        setIndexError('Failed to fetch index info');
        console.error('Error fetching index info:', err);
      } finally {
        setIndexLoading(false);
      }
    };

    fetchMarketData();
    fetchIndexData();
  }, []);

  // Simplified function to handle stock click - only passes symbol
  const handleStockClick = (stockData: StockDataForNavigation) => {
    router.push(`/stock/${stockData.symbol}`);
  };

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
                {indexLoading && (
                  <div className="flex justify-center items-center h-full text-gray-400">Loading indices...</div>
                )}
                {indexError && (
                  <div className="flex justify-center items-center h-full text-red-400">{indexError}</div>
                )}
                {!indexLoading && !indexError && indexData.length > 0 && (
                  indexData.map((index) => (
                    <div key={index.symbol} className="flex-1">
                      <MarketStockCard
                        name={index.shortName}
                        currentValue={index.currentPrice}
                        change={index.Change}
                        changePercentage={index.PercentChange}
                      />
                    </div>
                  ))
                )}
                {!indexLoading && !indexError && indexData.length === 0 && (
                  <div className="flex justify-center items-center h-full text-gray-400">No index data available</div>
                )}
              </div>
              
            </div>
            {/* Stock Table - positioned between gauge meters and news */}
            <div className="w-full mt-6">
              <StockTable className="w-full" onStockClick={handleStockClick} />
              {/* Top Movers below Stock Table */}
              <div className="mt-8">
                <TopMovers />
              </div>
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
