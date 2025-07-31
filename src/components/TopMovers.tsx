// src/components/TopMovers.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CurrentPrice, CurrentPriceService } from '@/lib/current_price';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

// --- Helper Functions ---
const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

const formatPercentChange = (percent: number) => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

const stripPostfix = (symbol: string) => symbol.replace(/\.NS$/i, '');

// --- Sub-components for a Cleaner Structure ---

// 1. Skeleton Loader for TopMovers
const TopMoversSkeleton: React.FC = () => {
  const SkeletonCard = () => (
    <div className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 shadow-sm">
      <div className="mb-4 h-6 w-24 animate-pulse rounded-md bg-gray-700/50"></div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded-md bg-gray-700/50"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-4 h-7 w-40 animate-pulse rounded-md bg-gray-700/50"></div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

// 2. A single row in a movers card
const MoverRow: React.FC<{ stock: CurrentPrice; isGainer: boolean; onClick: () => void }> = ({ stock, isGainer, onClick }) => (
  <li
    onClick={onClick}
    className="flex cursor-pointer items-center justify-between border-b border-[var(--border-color)] py-2.5 last:border-b-0 hover:bg-[var(--sidebar-hover)]"
  >
    <div>
      <p className="font-semibold text-[var(--foreground)]">{stripPostfix(stock.symbol)}</p>
      <p className="max-w-[120px] truncate text-xs text-[var(--foreground-muted)]" title={stock.companyName}>
        {stock.companyName}
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-[var(--foreground)]">₹{formatPrice(stock.currentPrice)}</p>
      <div className={`text-sm font-medium ${isGainer ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'}`}>
        {formatPercentChange(stock.PercentChange)}
      </div>
    </div>
  </li>
);

// 3. The card for either Gainers or Losers
const MoversCard: React.FC<{
  title: string;
  movers: CurrentPrice[];
  isGainer: boolean;
  onStockClick: (stock: CurrentPrice) => void;
}> = ({ title, movers, isGainer, onStockClick }) => (
  <div className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-4 shadow-sm">
    <h2 className="mb-3 text-lg font-bold text-[var(--foreground)]">{title}</h2>
    <ul>
      {movers.map(stock => (
        <MoverRow
          key={stock.symbol}
          stock={stock}
          isGainer={isGainer}
          onClick={() => onStockClick(stock)}
        />
      ))}
    </ul>
  </div>
);

// --- Main TopMovers Component ---
export default function TopMovers() {
  const router = useRouter();
  const [stocks, setStocks] = useState<CurrentPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const data = await CurrentPriceService.getCurrentPrices();
        setStocks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  // Memoize sorted gainers and losers
  const { topGainers, topLosers } = useMemo(() => {
    if (!stocks.length) {
      return { topGainers: [], topLosers: [] };
    }
    const sorted = [...stocks].sort((a, b) => b.PercentChange - a.PercentChange);
    const gainers = sorted.slice(0, 5);
    const losers = sorted.slice(-5).reverse();
    return { topGainers: gainers, topLosers: losers };
  }, [stocks]);

  const handleStockClick = (stock: CurrentPrice) => {
    router.push(`/stock/${encodeURIComponent(stock.symbol)}`);
  };

  if (loading) {
    return <TopMoversSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 py-12">
        <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
        <p className="font-semibold text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="mb-4 text-2xl font-bold text-[var(--foreground)]">Top Movers</h1>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <MoversCard title="Gainers" movers={topGainers} isGainer={true} onStockClick={handleStockClick} />
        <MoversCard title="Losers" movers={topLosers} isGainer={false} onStockClick={handleStockClick} />
      </div>
    </div>
  );
}