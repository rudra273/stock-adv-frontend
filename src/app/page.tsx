"use client";

import Link from 'next/link';
import {
  BarChart,
  BookOpen,
  Newspaper,
  MessageSquare,
  Search,
  LineChart,
  Settings,
  ArrowRight,
  LayoutDashboard // For Dashboard icon
} from 'lucide-react'; // Import necessary Lucid icons

export default function Home() {
  const navigationButtons = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-6 h-6" />, description: 'View your portfolio overview' },
    { name: 'Learn', href: '/learn', icon: <BookOpen className="w-6 h-6" />, description: 'Educational resources' },
    { name: 'News', href: '/news', icon: <Newspaper className="w-6 h-6" />, description: 'Latest market news' },
    { name: 'Chat', href: '/chat', icon: <MessageSquare className="w-6 h-6" />, description: 'AI trading assistant' },
    { name: 'Research', href: '/research', icon: <Search className="w-6 h-6" />, description: 'Stock analysis tools' },
    { name: 'Compare', href: '/compare', icon: <LineChart className="w-6 h-6" />, description: 'Compare stocks' },
  ];

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
            StockSavvy
          </h1>
          <p className="text-xl lg:text-xl text-gray-300 max-w-3xl">
            AI-Powered Stock Advisory Platform
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-12 lg:py-10">
            <h2 className="text-xl lg:text-3xl font-bold mb-6 text-white">
              Welcome to Your Trading Hub
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Navigate the stock market with confidence using our AI-powered insights,
              real-time data, and comprehensive analysis tools.
            </p>
          </section>

          {/* Navigation Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {navigationButtons.map((button) => (
              <Link
                key={button.name}
                href={button.href}
                className="group relative rounded-xl p-4 lg:p-6 transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--sidebar-bg)',
                  border: '1px solid var(--border-color)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  e.currentTarget.style.borderColor = 'var(--accent-green)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-bg)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent-green)' }}>
                    {button.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-white transition-colors">
                    {button.name}
                  </h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors text-sm">
                    {button.description}
                  </p>
                </div>
              </Link>
            ))}
          </section>

          {/* CTA Section */}
          <section className="text-center py-12 lg:py-16 mt-12">
            <div 
              className="rounded-2xl p-6 lg:p-8"
              style={{ 
                backgroundColor: 'var(--sidebar-bg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
                Ready to Start Trading Smarter?
              </h3>
              <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
                Join thousands of traders who trust StockSavvy for their investment decisions.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: 'var(--accent-green)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-green)';
                }}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 lg:p-8" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="max-w-7xl mx-auto text-center text-gray-300">
          <p>&copy; 2025 StockSavvy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}