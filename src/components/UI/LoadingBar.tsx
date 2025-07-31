// src/components/LoadingBar.tsx
'use client';

import React from 'react';

interface LoadingBarProps {
  message?: string;
}

export default function LoadingBar({ message = "Loading..." }: LoadingBarProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 text-center text-white/80 text-sm">
        {message}
      </div>
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full animate-pulse"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              var(--accent-green) 25%, 
              var(--accent-green) 75%, 
              transparent 100%)`,
            animation: 'loading-slide 2s ease-in-out infinite'
          }}
        />
      </div>
      <style jsx>{`
        @keyframes loading-slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}