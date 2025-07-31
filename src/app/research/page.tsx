// src/app/research/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ActionButton from '@/components/UI/ActionButton';

export default function ResearchInputPage() {
  const [symbol, setSymbol] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      router.push(`/research/${symbol.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] p-8 flex">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl h-40 mt-4 rounded-lg border bg-[var(--sidebar-bg)] p-10 shadow-lg flex flex-col justify-center"
        style={{ borderColor: 'var(--border-color)' }}
      >
        {/* <h1 className="mb-6 text-3xl font-bold text-[var(--foreground)] text-left">Research</h1> */}
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label htmlFor="symbol" className="block mb-2 text-sm font-medium text-[var(--foreground-muted)]">
              Enter Stock Symbol
            </label>
            <input
              id="symbol"
              type="text"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              placeholder="e.g. AAPL"
              className="w-full rounded-md border px-3 py-2 text-[var(--foreground)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              style={{ borderColor: 'var(--border-color)' }}
              autoFocus
            />
          </div>
          <ActionButton
            variant="primary"
            onClick={() => {
              if (symbol.trim()) {
                router.push(`/research/${symbol.trim().toUpperCase()}`);
              }
            }}
            disabled={!symbol.trim()}
          >
            Research
          </ActionButton>
        </div>
      </form>
    </div>
  );
}
