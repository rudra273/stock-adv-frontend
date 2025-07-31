// src/app/settings/page.tsx
'use client';

import React, { useState } from 'react';
import {
  triggerDailyPrices,
  triggerCurrentPrices,
  triggerStockInfo,
  triggerBalanceSheet,
  triggerIncomeStatement,
  triggerCashFlow,
  triggerMarketSentiment,
  triggerNews,
  triggerIndexInfo,
} from '../../lib/refresh';

const SettingsPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefresh = async (fn: () => Promise<any>, label: string) => {
    setLoading(label);
    setMessage(null);
    try {
      await fn();
      setMessage(`${label} triggered successfully.`);
    } catch (error) {
      setMessage(`Failed to trigger ${label}.`);
    } finally {
      setLoading(null);
    }
  };

  const triggers = [
    { 
      label: 'Daily Prices', 
      fn: triggerDailyPrices,
      description: 'Update daily stock price data'
    },
    { 
      label: 'Current Prices', 
      fn: triggerCurrentPrices,
      description: 'Fetch real-time stock prices'
    },
    { 
      label: 'Stock Info Ingestion', 
      fn: triggerStockInfo,
      description: 'Refresh company information and metadata'
    },
    { 
      label: 'Balance Sheet Ingestion', 
      fn: triggerBalanceSheet,
      description: 'Update balance sheet data'
    },
    { 
      label: 'Income Statement Ingestion', 
      fn: triggerIncomeStatement,
      description: 'Refresh income statement data'
    },
    { 
      label: 'Cash Flow Ingestion', 
      fn: triggerCashFlow,
      description: 'Update cash flow statement data'
    },
    { 
      label: 'Market Sentiment Ingestion', 
      fn: triggerMarketSentiment,
      description: 'Refresh market sentiment analysis'
    },
    {
      label: 'News Ingestion',
      fn: triggerNews,
      description: 'Fetch and update latest news articles'
    },
    {
      label: 'Index Info Ingestion',
      fn: triggerIndexInfo,
      description: 'Update and refresh index information'
    },
  ];

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-300">Manage data ingestion and system triggers</p>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
              <span className="text-yellow-300">Triggering {loading}...</span>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('successfully') 
              ? 'bg-green-900/20 border-green-700/30 text-green-300' 
              : 'bg-red-900/20 border-red-700/30 text-red-300'
          }`}>
            {message}
          </div>
        )}

        {/* Data Ingestion Section */}
        <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/50">
            <h2 className="text-xl font-semibold text-white">Data Ingestion</h2>
            <p className="text-gray-400 text-sm mt-1">Trigger data refresh operations</p>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4">
              {triggers.map(({ label, fn, description }) => (
                <div 
                  key={label} 
                  className="flex items-center justify-between p-4 bg-gray-800/40 rounded-lg border border-gray-700/30 hover:bg-gray-800/60 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{label}</h3>
                    <p className="text-sm text-gray-400 mt-1">{description}</p>
                  </div>
                  
                  <button
                    className={`px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                      loading === label
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
                    }`}
                    disabled={loading === label}
                    onClick={() => handleRefresh(fn, label)}
                  >
                    {loading === label ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Trigger</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-gray-300">
                <strong>Note:</strong> Data ingestion processes may take several minutes to complete. 
                Please wait for confirmation before triggering additional operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;