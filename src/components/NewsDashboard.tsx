// components/NewsDashboard.tsx
// in backend store olly 4 latest news.

'use client';

import React from 'react';

interface NewsItem {
  id: number;
  headline: string;
  description: string;
  status: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  url?: string;
}

const NewsDashboard: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      headline: "Fed Signals Dovish Stance on Interest Rates",
      description: "Federal Reserve officials hint at potential rate cuts in upcoming meetings, boosting market sentiment across major indices",
      status: 'positive',
      timestamp: '2 hours ago',
      url: 'https://example.com/fed-signals-news'
    },
    {
      id: 2,
      headline: "Tech Earnings Beat Expectations",
      description: "Major technology companies report stronger than expected quarterly earnings, driving sector-wide gains in after-hours trading",
      status: 'positive',
      timestamp: '4 hours ago',
      url: 'https://example.com/tech-earnings-news'
    },
    {
      id: 3,
      headline: "Oil Prices Show Volatility Amid Supply Concerns",
      description: "Crude oil futures experience mixed trading as geopolitical tensions raise supply disruption concerns while demand outlook remains uncertain",
      status: 'neutral',
      timestamp: '6 hours ago',
      url: 'https://example.com/oil-prices-news'
    },
    {
      id: 4,
      headline: "Global Markets React to Inflation Data",
      description: "Stock markets worldwide see mixed reactions as new inflation data prompts uncertainty about future central bank policies",
      status: 'negative',
      timestamp: '8 hours ago',
      url: 'https://example.com/global-markets-inflation'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      case 'neutral':
        return 'text-yellow-400';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      case 'neutral':
        return '→';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-2 h-full" style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Market News</h2>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-green)' }}></div>
      </div>
      
      <div className="space-y-4">
        {newsItems.map((item) => (
          <div key={item.id} className="border-l-2 pl-4 pb-4" style={{ borderLeftColor: 'var(--border-color)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${getStatusColor(item.status)}`}>
                  {getStatusIndicator(item.status)}
                </span>
                <h3 className="font-medium text-white text-sm leading-tight">
                  {item.headline}
                </h3>
              </div>
            </div>
            
            <p className="text-gray-300 text-xs leading-relaxed mb-2" style={{ color: 'var(--foreground)' }}>
              {item.description}
              {item.url && (
                <>
                  {' '}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:underline"
                  >
                    ..read more
                  </a>
                </>
              )}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{item.timestamp}</span>
              <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)} bg-opacity-20`} 
                   style={{ backgroundColor: item.status === 'positive' ? 'rgba(16, 185, 129, 0.1)' : 
                                           item.status === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 
                                           'rgba(245, 158, 11, 0.1)' }}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4" style={{ borderTopColor: 'var(--border-color)' }}>
        <button className="w-full text-sm text-gray-400 hover:text-white transition-colors" 
                style={{ color: 'var(--foreground)' }}>
          View All News →
        </button>
      </div>
    </div>
  );
};

export default NewsDashboard;