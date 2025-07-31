// src/components/Stock/FinancialsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FinancialsService, BalanceSheet, IncomeStatement } from '@/lib/financials';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts'; // Updated imports (removed unused ones)

interface FinancialsSectionProps {
  symbol: string;
}

type TabType = 'Performance' | 'Fundamentals' | 'Financials';
type FinancialSubTab = 'Revenue' | 'Profit' | 'Net Worth';

export default function FinancialsSection({ symbol }: FinancialsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Financials');
  const [activeSubTab, setActiveSubTab] = useState<FinancialSubTab>('Revenue');
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet[]>([]);
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'Financials') {
      fetchFinancialData();
    }
  }, [symbol, activeTab]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [balanceSheetData, incomeStatementData] = await Promise.all([
        FinancialsService.getBalanceSheet(symbol),
        FinancialsService.getIncomeStatement(symbol),
      ]);
      setBalanceSheet(balanceSheetData);
      setIncomeStatement(incomeStatementData);
    } catch (err) {
      setError('Failed to fetch financial data');
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return '$0';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const getRevenueData = () => {
    return incomeStatement
      .filter(item => item.total_revenue !== null && item.total_revenue !== undefined)
      .slice(-5)
      .map(item => ({
        year: new Date(item.Date).getFullYear(),
        value: item.total_revenue || 0
      }));
  };

  const getProfitData = () => {
    return incomeStatement
      .filter(item => item.net_income !== null && item.net_income !== undefined)
      .slice(-5)
      .map(item => ({
        year: new Date(item.Date).getFullYear(),
        value: item.net_income || 0
      }));
  };

  const getNetWorthData = () => {
    return balanceSheet
      .filter(item => item.stockholders_equity !== null && item.stockholders_equity !== undefined)
      .slice(-5)
      .map(item => ({
        year: new Date(item.Date).getFullYear(),
        value: item.stockholders_equity || 0
      }));
  };

  const getCurrentData = () => {
    switch (activeSubTab) {
      case 'Revenue':
        return getRevenueData();
      case 'Profit':
        return getProfitData();
      case 'Net Worth':
        return getNetWorthData();
      default:
        return [];
    }
  };

  const calculateGrowthRate = (data: { year: number; value: number }[]) => {
    if (data.length < 2) return 0;
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    if (firstValue === 0) return 0;
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const renderChart = () => {
    const data = getCurrentData();

    if (data.length === 0) {
      return (
        <div className="text-center py-8">
          <span className="text-gray-400">No data available for {activeSubTab}</span>
        </div>
      );
    }

    const currentValue = data[data.length - 1]?.value || 0;
    const growthRate = calculateGrowthRate(data);

    return (
      <div className="mt-6">
        <div className="flex items-baseline gap-4 mb-4">
          <h3 className="text-2xl font-bold text-white">
            {activeSubTab}
          </h3>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(currentValue)}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-400">
            {data[0]?.year}-{data[data.length - 1]?.year}
          </span>
          <span className={`text-sm ${growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="year" stroke="#888" />
            <YAxis hide={true} /> {/* Hides Y-axis numbers and lines */}
            <Bar 
              dataKey="value" 
              fill="#16a34a" 
              barSize={50} 
              radius={[4, 4, 0, 0]}
            >
              <LabelList 
                dataKey="value" 
                position="top" 
                formatter={formatCurrency} 
                fill="#d1d5db" // Light gray for visibility
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Debug info - remove this after testing */}
        <div className="mt-4 text-xs text-gray-500">
          Data points: {data.length} | Max value: {formatCurrency(Math.max(...data.map(d => d.value)))}
        </div>
      </div>
    );
  };

  const renderFinancialSubTabs = () => {
    const subTabs: FinancialSubTab[] = ['Revenue', 'Profit', 'Net Worth'];
    return (
      <div className="border-b border-gray-700 mb-6">
        <div className="flex gap-8">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeSubTab === tab
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === 'Performance') {
      return (
        <div className="text-center py-8">
          <span className="text-gray-400">Performance data coming soon...</span>
        </div>
      );
    }

    if (activeTab === 'Fundamentals') {
      return (
        <div className="text-center py-8">
          <span className="text-gray-400">Fundamentals data coming soon...</span>
        </div>
      );
    }

    if (activeTab === 'Financials') {
      if (loading) {
        return (
          <div className="text-center py-8">
            <span className="text-gray-400">Loading financial data...</span>
          </div>
        );
      }
      if (error) {
        return (
          <div className="text-center py-8">
            <span className="text-red-400">{error}</span>
          </div>
        );
      }
      return (
        <div>
          {renderFinancialSubTabs()}
          {renderChart()}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'var(--card-background, rgba(255, 255, 255, 0.05))' }}>
      {/* Main Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex gap-8">
          {(['Performance', 'Fundamentals', 'Financials'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
