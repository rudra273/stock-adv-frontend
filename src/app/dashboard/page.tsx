// app/dashboard/page.tsx 
'use client';

import React, { useState, useEffect } from 'react';
import MarketIndexCard from '../../components/MarketIndexCard';
import { MarketSentiment, MarketIndexService } from '@/lib/market_index';

export default function Dashboard() {
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

  return (
    <div className="min-h-screen text-white p-2" style={{ backgroundColor: 'var(--background)' }}>
      
      {/* Market Index Section */}
      <section className="mb-8">
        
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
          /* CARD SIZE ADJUSTMENT: 
             - Mobile: w-full (full width)
             - Desktop: sm:w-72, sm:w-64, sm:w-80, sm:w-96 etc.
             - Change gap-4 to gap-2, gap-6, gap-8 to adjust spacing between cards */
          <div className="flex flex-wrap gap-4 justify-start max-w-none">
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
      </section>

      {/* Space for additional dashboard content */}
      <section className="mb-8">
        {/* Add your other dashboard widgets/charts here */}
        {/* This area is now available since cards are compact and left-aligned */}
      </section>
    </div>
  );
}