// src/components/UI/ActionButton.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  href?: string;
  symbol?: string;
}

export default function ActionButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  href,
  symbol
}: ActionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    
    if (href && symbol) {
      router.push(`${href}/${symbol}`);
    } else if (onClick) {
      onClick();
    }
  };

  const baseClasses = `
    px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 
    border cursor-pointer select-none
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
  `;

  const variantClasses = variant === 'primary' 
    ? `bg-accent-green text-white border-accent-green hover:bg-green-600 hover:border-green-600 shadow-lg`
    : `bg-transparent text-white border-border-color hover:bg-sidebar-hover hover:border-accent-green`;

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      onClick={handleClick}
      disabled={disabled}
      style={{
        backgroundColor: variant === 'primary' ? 'var(--accent-green)' : 'transparent',
        borderColor: variant === 'primary' ? 'var(--accent-green)' : 'var(--border-color)',
        color: 'var(--foreground)'
      }}
    >
      {children}
    </button>
  );
}