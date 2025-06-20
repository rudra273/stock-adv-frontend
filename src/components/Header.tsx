// // components/Header.tsx

'use client';

import Link from 'next/link';
import { LineChart } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
}

const Header = ({ onProfileClick }: HeaderProps) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-12 flex items-center justify-between px-4"
      style={{ backgroundColor: 'var(--sidebar-bg)' }}
    >
      {/* Left side - Profile Picture and Name */}
      <button
        onClick={onProfileClick}
        className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-800 transition-all"
        aria-label="Open menu"
      >
        <div className="pt w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
          RM
        </div>
        {/* Show name only on large screens */}
        <span className="hidden lg:block text-white font-medium">
          Rudra Mohanty
        </span>
      </button>

      {/* Right side - Brand */}
      <Link href="/" className="flex items-center space-x-2 group">
        <LineChart className="w-6 h-6 text-green-500 group-hover:text-green-400 transition-colors" />
        <span className="text-lg font-bold text-white">StockSavvy</span>
      </Link>
    </header>
  );
};

export default Header;