// src/app/research/[symbol]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ResearchAgentService, ResearchAgentResponse } from '@/lib/ResearchAgent';
import { ArrowLeft, AlertCircle, Bot, FileText, Globe, Link as LinkIcon, Server } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; 

// --- Sub-components for a Cleaner UI ---

// Reusable card for the right sidebar
const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="rounded-md border bg-[var(--background)] p-3" style={{ borderColor: 'var(--border-color)' }}>
    <div className="mb-2 flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-semibold text-[var(--foreground-muted)]">{title}</h3>
    </div>
    {children}
  </div>
);

// Card for displaying a main report section
// 👇 2. UPDATE THIS COMPONENT
const ReportSection: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
  <div className="rounded-lg border bg-[var(--sidebar-bg)] p-4" style={{ borderColor: 'var(--border-color)' }}>
    <div className="mb-3 flex items-center gap-2">
      {icon}
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    {/* Use ReactMarkdown with prose classes for styling */}
    <div className="prose prose-invert max-w-none text-sm leading-relaxed text-[var(--foreground-muted)] prose-headings:text-[var(--foreground)] prose-strong:text-[var(--foreground)] prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </div>
);


// Skeleton loader reflecting the new layout
const ResearchSkeleton: React.FC = () => (
  <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--background)' }}>
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 h-8 w-64 animate-pulse rounded-md bg-gray-700/50"></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column Skeleton */}
        <div className="space-y-6 lg:col-span-2">
          <div className="h-56 w-full animate-pulse rounded-md bg-gray-700/50"></div>
          <div className="h-64 w-full animate-pulse rounded-md bg-gray-700/50"></div>
          <div className="h-48 w-full animate-pulse rounded-md bg-gray-700/50"></div>
        </div>
        {/* Right Column Skeleton */}
        <div className="space-y-4 lg:col-span-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 w-full animate-pulse rounded-md bg-gray-700/50"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Header component for title and navigation
const PageHeader: React.FC<{ symbol: string; companyName: string; }> = ({ symbol, companyName }) => {
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
          Generated on: {new Date().toLocaleDateString()}
        </div>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">AI-Generated Research Report</h1>
      <span className="text-lg font-semibold text-[var(--foreground-muted)]">
        {companyName} ({symbol})
      </span>
    </div>
  );
};


// --- Main Page Component ---
export default function ResearchPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [data, setData] = useState<ResearchAgentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) {
        setLoading(false);
        setError("No stock symbol provided in the URL.");
        return;
    }
    const fetchResearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await ResearchAgentService.getResearchAgent(symbol);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch research report.');
        console.error('Error fetching research report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, [symbol]);

  if (loading) return <ResearchSkeleton />;

  if (error || !data) {
    return (
      <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 py-20">
          <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
          <p className="text-lg font-semibold text-red-400">{error || "No research data available."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-7xl">
        <PageHeader
          symbol={data.symbol}
          companyName={data.company_name}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT COLUMN (MAIN REPORT) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <ReportSection
              icon={<Bot size={18} className="text-[var(--accent-green)]" />}
              title="Overall Summary"
              content={data.overall_summary}
            />
            <ReportSection
              icon={<FileText size={18} className="text-blue-400" />}
              title="Stock Summary"
              content={data.stock_summary}
            />
             <ReportSection
              icon={<Globe size={18} className="text-purple-400" />}
              title="Market Summary"
              content={data.market_summary}
            />
          </div>

          {/* RIGHT COLUMN (SOURCES) */}
          <div className="flex flex-col gap-4 lg:col-span-1">
             <InfoCard icon={<Globe size={16} className="text-cyan-400" />} title="Domains">
              <div className="space-y-1 text-sm text-[var(--foreground-muted)]">
                {data.sources.domains.map((domain, index) => (
                    <p key={index} className="truncate">{domain}</p>
                ))}
              </div>
            </InfoCard>

            <InfoCard icon={<LinkIcon size={16} className="text-green-400" />} title="Source URLs">
                <div className="space-y-1.5 text-sm">
                    {data.sources.urls.slice(0, 5).map((url, index) => ( // Display first 5 to prevent overflow
                        <a
                            href={url}
                            key={index}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-blue-400 transition-colors hover:text-blue-300"
                            title={url}
                        >
                            {url}
                        </a>
                    ))}
                    {data.sources.urls.length > 5 && (
                        <p className="mt-2 text-xs text-[var(--foreground-muted)]">+ {data.sources.urls.length - 5} more</p>
                    )}
                </div>
            </InfoCard>

            <InfoCard icon={<Server size={16} className="text-yellow-400" />} title="API Sources">
               <div className="flex flex-wrap gap-2">
                 {data.sources.api_sources.map((api, index) => (
                    <span key={index} className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-400">
                      {api}
                    </span>
                 ))}
               </div>
            </InfoCard>
          </div>

        </div>
      </div>
    </div>
  );
}