// components/NewsDashboard.tsx
// in backend store olly 4 latest news.

'use client';

import React, { useEffect, useState } from 'react';
import { NewsService, NewsItem } from '../lib/news';

function formatPublishedAt(publishedAt: string): string {
  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const diffMs = now.getTime() - publishedDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay >= 1) {
    // Show as 'YYYY-MM-DD HH:mm'
    return publishedDate.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } else if (diffHr >= 1) {
    return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  } else if (diffMin >= 1) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

const NewsDashboard: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await NewsService.getAllNews();
        setNewsItems(news);
      } catch (err) {
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

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

  if (loading) {
    return <div className="bg-gray-800 rounded-lg p-2 h-full text-white">Loading news...</div>;
  }
  if (error) {
    return <div className="bg-gray-800 rounded-lg p-2 h-full text-red-400">{error}</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-2 h-full" style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Market News</h2>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-green)' }}></div>
      </div>
      <div className="space-y-4">
        {newsItems.map((item, idx) => (
          <div key={item.url + idx} className="border-l-2 pl-4 pb-4" style={{ borderLeftColor: 'var(--border-color)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${getStatusColor(item.sentiment)}`}>
                  {getStatusIndicator(item.sentiment)}
                </span>
                <h3 className="font-medium text-white text-sm leading-tight">
                  {item.title}
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
                    ...read more
                  </a>
                </>
              )}
            </p>
            <div className="flex justify-between items-center mb-1">
              <div className="flex flex-col gap-1 text-xs text-gray-400">
                <span><b>Source:</b> {item.source_name}</span>
                <span><b>Published:</b> {formatPublishedAt(item.published_at)}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.sentiment)} bg-opacity-20`} 
                   style={{ backgroundColor: item.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.1)' : 
                                           item.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 
                                           'rgba(245, 158, 11, 0.1)' }}>
                {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
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