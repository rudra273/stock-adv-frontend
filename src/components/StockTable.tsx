// src/components/StockTable.tsx
'use client';

import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { CurrentPrice, CurrentPriceService } from '@/lib/current_price';
import { Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

// --- Type Definitions ---
interface StockDataForNavigation {
  symbol: string;
}

interface StockTableProps {
  className?: string;
  onStockClick?: (stockData: StockDataForNavigation) => void;
}

// --- Helper Functions ---
const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

const formatChange = (change: number) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${formatPrice(change)}`;
};

const formatPercentChange = (percent: number) => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

const stripPostfix = (symbol: string) => symbol.replace(/\.NS$/i, '');

// --- Sub-components for a Cleaner Structure ---

// 1. Search Input Component
const SearchInput: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <div className="relative w-full max-w-xs">
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
      size={18}
    />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search stocks..."
      className="w-full rounded-md border bg-[var(--sidebar-bg)] py-2 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]"
      style={{ borderColor: 'var(--border-color)' }}
    />
  </div>
);

// 2. Stock Card for Mobile View
const StockCard: React.FC<{ stock: CurrentPrice; onClick: () => void }> = ({ stock, onClick }) => {
  const isPositive = stock.Change >= 0;
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-[var(--sidebar-bg)] p-4 transition-all duration-200 hover:border-[var(--accent-green)]/50 hover:shadow-lg"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate font-bold text-[var(--foreground)]">{stripPostfix(stock.symbol)}</p>
          <p className="truncate text-sm text-[var(--foreground-muted)]" title={stock.companyName}>
            {stock.companyName}
          </p>
        </div>
        <div className="flex flex-col items-end text-right">
          <p className="mb-1 font-semibold text-[var(--foreground)]">₹{formatPrice(stock.currentPrice)}</p>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${isPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'}`}>
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{formatChange(stock.Change)}</span>
            <span className="text-[var(--foreground-muted)]">({formatPercentChange(stock.PercentChange)})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Stock Table Row for Desktop View
const StockTableRow: React.FC<{ stock: CurrentPrice; onClick: () => void }> = ({ stock, onClick }) => {
  const isPositive = stock.Change >= 0;
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-[var(--border-color)] text-sm transition-colors duration-200 hover:bg-[var(--sidebar-hover)]" // UPDATED: text-sm added
    >
      {/* UPDATED: py-2 for slimmer rows, smaller text classes */}
      <td className="py-2 px-4">
        <p className="max-w-xs truncate font-medium text-[var(--foreground)]" title={stock.companyName}>
          {stock.companyName}
        </p>
        <p className="text-xs text-[var(--foreground-muted)]">{stripPostfix(stock.symbol)}</p>
      </td>
      <td className="py-2 px-4 text-right font-semibold text-[var(--foreground)]">
        {formatPrice(stock.currentPrice)}
      </td>
      <td className={`py-2 px-4 text-right font-medium ${isPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'}`}>
        {formatChange(stock.Change)}
      </td>
      <td className={`py-2 px-4 text-right font-medium ${isPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'}`}>
        {formatPercentChange(stock.PercentChange)}
      </td>
    </tr>
  );
};

// 4. Reusable Pagination Component
const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }
    if (currentPage >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  if (totalPages <= 1) return null; // Don't show pagination if only one page

  return (
    <div className="mt-6 flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-md bg-[var(--sidebar-bg)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--sidebar-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className="h-10 w-10 rounded-md text-sm font-medium transition-colors duration-200"
          style={{
            backgroundColor: currentPage === pageNum ? 'var(--accent-green)' : 'var(--sidebar-bg)',
            color: currentPage === pageNum ? 'black' : 'var(--foreground)',
          }}
        >
          {pageNum}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-md bg-[var(--sidebar-bg)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--sidebar-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

// 5. Skeleton Loader Component
const TableSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <div className="mb-4 flex items-center justify-between">
      <div className="h-8 w-48 animate-pulse rounded-md bg-gray-700/50"></div>
      <div className="h-11 w-full max-w-xs animate-pulse rounded-md bg-gray-700/50"></div>
    </div>
    <div className="space-y-2">
      {/* UPDATED: 6 rows, slimmer height */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 w-full animate-pulse rounded-md bg-gray-700/50"></div>
      ))}
    </div>
  </div>
);

// --- Main StockTable Component ---
export default function StockTable({ className = '', onStockClick }: StockTableProps) {
  const [stocks, setStocks] = useState<CurrentPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const stocksPerPage = 6; // UPDATED: Now shows 6 rows

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const data = await CurrentPriceService.getCurrentPrices();
        setStocks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data. Please try again later.');
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStockClick = (stock: CurrentPrice) => {
    onStockClick?.({ symbol: stock.symbol });
  };

  const filteredStocks = useMemo(() =>
    stocks.filter(
      stock =>
        stock.companyName.toLowerCase().includes(search.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(search.toLowerCase())
    ), [stocks, search]
  );

  const totalFilteredPages = Math.ceil(filteredStocks.length / stocksPerPage);

  const currentPageStocks = useMemo(() => {
    const startIndex = (currentPage - 1) * stocksPerPage;
    return filteredStocks.slice(startIndex, startIndex + stocksPerPage);
  }, [filteredStocks, currentPage, stocksPerPage]);


  if (loading) {
    return <TableSkeleton className={className} />;
  }

  if (error) {
    return (
      <div className={`${className} flex flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 py-12`}>
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
        <p className="text-lg font-semibold text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-xl font-bold text-[var(--foreground)]">Market Movers</h1>
        <SearchInput value={search} onChange={handleSearchChange} />
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {currentPageStocks.map(stock => (
          <StockCard key={stock.symbol} stock={stock} onClick={() => handleStockClick(stock)} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden rounded-lg border border-[var(--border-color)] bg-[var(--sidebar-bg)]/50 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Company</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Price (₹)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Change</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">% Change</th>
              </tr>
            </thead>
            <tbody>
              {currentPageStocks.map(stock => (
                <StockTableRow key={stock.symbol} stock={stock} onClick={() => handleStockClick(stock)} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalFilteredPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}