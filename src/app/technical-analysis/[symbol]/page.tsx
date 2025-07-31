// src/app/technical-analysis/[symbol]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TechnicalAgentService, TechnicalAgentResponse } from '@/lib/TechnicalAgent';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Volume2, Target, AlertCircle, BarChart3, Zap, Gauge, FileText, Bot } from 'lucide-react';

// --- Type Definitions ---
type Sentiment = 'bullish' | 'bearish' | 'neutral' | string;

// --- Helper Functions ---
const getSentimentStyle = (sentiment: Sentiment): { color: string; bgColor: string; borderColor: string } => {
  const s = sentiment.toLowerCase();
  if (s === 'bullish') return { color: 'var(--color-positive)', bgColor: 'var(--color-positive-bg)', borderColor: 'var(--color-positive-border)' };
  if (s === 'bearish') return { color: 'var(--color-negative)', bgColor: 'var(--color-negative-bg)', borderColor: 'var(--color-negative-border)' };
  return { color: '#f59e0b', bgColor: '#f59e0b20', borderColor: '#f59e0b40' }; // Neutral
};

const getRSIColor = (rsi: number) => {
  if (rsi >= 70) return 'var(--color-negative)'; // Overbought
  if (rsi <= 30) return 'var(--color-positive)'; // Oversold
  return '#f59e0b'; // Neutral
};

// --- Sub-components for a Cleaner & Denser UI ---

// Reusable card for the right sidebar
const IndicatorCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="rounded-md border bg-[var(--background)] p-3" style={{ borderColor: 'var(--border-color)' }}>
    <div className="mb-2 flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-semibold text-[var(--foreground-muted)]">{title}</h3>
    </div>
    {children}
  </div>
);

// Skeleton loader reflecting the new layout
const AnalysisSkeleton: React.FC = () => (
  <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--background)' }}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 h-8 w-64 animate-pulse rounded-md bg-gray-700/50"></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column Skeleton */}
        <div className="space-y-6 lg:col-span-2">
          <div className="h-48 w-full animate-pulse rounded-md bg-gray-700/50"></div>
          <div className="h-64 w-full animate-pulse rounded-md bg-gray-700/50"></div>
          <div className="h-56 w-full animate-pulse rounded-md bg-gray-700/50"></div>
        </div>
        {/* Right Column Skeleton */}
        <div className="space-y-4 lg:col-span-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-md bg-gray-700/50"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Header component for title and navigation
const PageHeader: React.FC<{ symbol: string; companyName: string; price: number; date: string }> = ({ symbol, companyName, price, date }) => {
  const router = useRouter();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/stock/${symbol}`)}
          className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={16} />
          Back to {symbol}
        </button>
        <div className="text-xs text-[var(--foreground-muted)]">
          {new Date(date).toLocaleString()}
        </div>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">Technical Analysis: {companyName}</h1>
      <span className="text-lg font-semibold text-[var(--color-positive)]">
        ₹{price.toFixed(2)}
      </span>
    </div>
  );
};


// --- Main Page Component ---
export default function TechnicalAnalysisPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [data, setData] = useState<TechnicalAgentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await TechnicalAgentService.getTechnicalAgent(symbol);
        setData(result);
      } catch (err) {
        setError('Failed to fetch technical analysis.');
        console.error('Error fetching technical analysis:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [symbol]);

  if (loading) return <AnalysisSkeleton />;

  if (error || !data) {
    return (
        <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--background)' }}>
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 py-20">
            <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
            <p className="text-lg font-semibold text-red-400">{error || "No analysis data available."}</p>
          </div>
        </div>
    );
  }
  
  const sentimentStyle = getSentimentStyle(data.executive_summary.overall_sentiment);
  const macdHistogramColor = data.raw_technical_data.macd.histogram >= 0 ? 'var(--color-positive)' : 'var(--color-negative)';
  const obvTrendStyle = getSentimentStyle(data.raw_technical_data.obv.obv_trend);

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-7xl">
        <PageHeader 
          symbol={data.symbol} 
          companyName={data.company_name} 
          price={data.current_price} 
          date={data.analysis_date} 
        />
        
        {/* NEW TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* LEFT COLUMN (MAIN CONTENT) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Executive Summary */}
            <div className="rounded-lg border bg-[var(--sidebar-bg)] p-4" style={{ borderColor: 'var(--border-color)' }}>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Bot size={20} className="text-[var(--accent-green)]" />
                  <h2 className="text-lg font-semibold">Executive Summary</h2>
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={sentimentStyle}>
                  {data.executive_summary.overall_sentiment}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">{data.executive_summary.llm_generated_thesis}</p>
            </div>
            
            {/* Key Metrics Table */}
            <div className="rounded-lg border bg-[var(--sidebar-bg)] p-4" style={{ borderColor: 'var(--border-color)' }}>
               <div className="mb-3 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[var(--accent-green)]" />
                  <h2 className="text-lg font-semibold">Key Metrics</h2>
                </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {data.data_table.map((item, index) => (
                  <div key={index} className="rounded-md border bg-[var(--background)] p-3" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-xs text-[var(--foreground-muted)]">{item.category}</p>
                    <p className="font-semibold">{item.metric}: <span className="font-bold text-[var(--color-positive)]">{item.value}</span></p>
                    <p className="mt-1 text-xs text-[var(--foreground-muted)]">{item.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative Analysis */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-[var(--sidebar-bg)] p-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp size={18} className="text-[var(--color-positive)]" />
                  <h3 className="text-base font-semibold">Bullish Outlook</h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">{data.llm_generated_narrative_analysis.bullish_outlook}</p>
              </div>
              <div className="rounded-lg border bg-[var(--sidebar-bg)] p-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="mb-3 flex items-center gap-2">
                  <TrendingDown size={18} className="text-[var(--color-negative)]" />
                  <h3 className="text-base font-semibold">Bearish Outlook</h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">{data.llm_generated_narrative_analysis.bearish_outlook}</p>
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN (AT-A-GLANCE SIDEBAR) */}
          <div className="flex flex-col gap-4 lg:col-span-1">
             <IndicatorCard icon={<Target size={16} className="text-blue-400" />} title="Key Levels">
              <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-[var(--foreground-muted)]">Support</p>
                    <p className="font-semibold">₹{data.executive_summary.key_levels.support.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--foreground-muted)]">Resistance</p>
                    <p className="font-semibold">₹{data.executive_summary.key_levels.resistance.toFixed(2)}</p>
                  </div>
              </div>
            </IndicatorCard>

            <IndicatorCard icon={<TrendingUp size={16} className="text-cyan-400" />} title="Moving Averages">
               <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--foreground-muted)]">MA 50</span> <span className="font-semibold">₹{data.raw_technical_data.moving_averages.MA_50.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--foreground-muted)]">MA 200</span> <span className="font-semibold">₹{data.raw_technical_data.moving_averages.MA_200.toFixed(2)}</span></div>
               </div>
            </IndicatorCard>

            <IndicatorCard icon={<Gauge size={16} className="text-purple-400" />} title="Relative Strength Index (RSI)">
              <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: getRSIColor(data.raw_technical_data.rsi) }}>{data.raw_technical_data.rsi.toFixed(2)}</p>
                  <p className="text-xs" style={{ color: getRSIColor(data.raw_technical_data.rsi) }}>
                    {data.raw_technical_data.rsi >= 70 ? 'Overbought' : data.raw_technical_data.rsi <= 30 ? 'Oversold' : 'Neutral'}
                  </p>
              </div>
            </IndicatorCard>

             <IndicatorCard icon={<Zap size={16} className="text-yellow-400" />} title="MACD">
               <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-[var(--foreground-muted)]">MACD</span> <span className="font-semibold">{data.raw_technical_data.macd.macd.toFixed(3)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--foreground-muted)]">Signal</span> <span className="font-semibold">{data.raw_technical_data.macd.signal.toFixed(3)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--foreground-muted)]">Histogram</span> <span className="font-semibold" style={{ color: macdHistogramColor }}>{data.raw_technical_data.macd.histogram.toFixed(3)}</span></div>
               </div>
            </IndicatorCard>

            <IndicatorCard icon={<Activity size={16} className="text-green-400" />} title="Stochastic Oscillator">
               <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--foreground-muted)]">%K</span> <span className="font-semibold">{data.raw_technical_data.stochastic.percent_k.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--foreground-muted)]">%D</span> <span className="font-semibold">{data.raw_technical_data.stochastic.percent_d.toFixed(2)}</span></div>
               </div>
            </IndicatorCard>

            <IndicatorCard icon={<Volume2 size={16} className="text-orange-400" />} title="On-Balance Volume (OBV)">
              <div className="text-center">
                  <p className="text-lg font-semibold">{(data.raw_technical_data.obv.obv / 1_000_000).toFixed(2)}M</p>
                  <p className="text-xs font-medium" style={{ color: obvTrendStyle.color }}>Trend: {data.raw_technical_data.obv.obv_trend}</p>
              </div>
            </IndicatorCard>
          </div>

        </div>
      </div>
    </div>
  );
}