// src/components/Stock/StockGraph.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { DailyPrice, DailyPriceService } from '@/lib/DailyPrice';

interface StockGraphProps {
  symbol: string;
}

interface KeyMetrics {
  open: number;
  high: number;
  low: number;
  volume: number;
}

export default function StockGraph({ symbol }: StockGraphProps) {
  const [data, setData] = useState<DailyPrice[]>([]);
  const [filteredData, setFilteredData] = useState<DailyPrice[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'1W' | '1M' | '6M' | '1Y'>('1M');
  const [keyMetrics, setKeyMetrics] = useState<KeyMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dailyPrices = await DailyPriceService.getDailyPrices(symbol);
        setData(dailyPrices);
        
        // Set key metrics from latest data
        if (dailyPrices.length > 0) {
          const latest = dailyPrices[dailyPrices.length - 1];
          setKeyMetrics({
            open: latest.Open,
            high: latest.High,
            low: latest.Low,
            volume: latest.Volume
          });
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  useEffect(() => {
    if (data.length === 0) return;

    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case '1W':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    const filtered = data.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate >= startDate;
    });

    setFilteredData(filtered);
  }, [data, selectedPeriod]);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--border-color)' }}>
        <div className="text-center text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--border-color)' }}>
      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <XAxis 
              dataKey="Date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Line 
              type="monotone" 
              dataKey="Close" 
              stroke="var(--accent-green)" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--accent-green)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time Period Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex rounded-lg p-1" style={{ backgroundColor: 'var(--background)' }}>
          {(['1W', '1M', '6M', '1Y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedPeriod === period 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedPeriod === period ? 'var(--accent-green)' : 'transparent'
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
            <p className="text-gray-400 text-sm mb-1">Open</p>
            <p className="text-white text-lg font-semibold">
              ${keyMetrics?.open.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
            <p className="text-gray-400 text-sm mb-1">High</p>
            <p className="text-white text-lg font-semibold">
              ${keyMetrics?.high.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
            <p className="text-gray-400 text-sm mb-1">Low</p>
            <p className="text-white text-lg font-semibold">
              ${keyMetrics?.low.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border-color)' }}>
            <p className="text-gray-400 text-sm mb-1">Volume</p>
            <p className="text-white text-lg font-semibold">
              {keyMetrics ? formatVolume(keyMetrics.volume) : '0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}