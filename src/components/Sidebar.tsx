// // components/Sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, BarChart2, BookOpen, Settings, LayoutDashboard, X } from 'lucide-react';
import { Bookmark } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="mr-3 w-5 h-5" /> },
    { name: 'Watchlists', href: '/watchlists', icon: <Bookmark className="mr-3 w-5 h-5" /> },
    { name: 'Research', href: '/research', icon: <Search className="mr-3 w-5 h-5" /> },
    { name: 'Compare', href: '/compare', icon: <BarChart2 className="mr-3 w-5 h-5" /> },
    { name: 'Learn', href: '/learn', icon: <BookOpen className="mr-3 w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto lg:block
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        {/* Mobile Header with Close button and Profile - only visible on mobile when open */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
              RM
            </div>
            <div>
              <p className="text-white font-medium text-sm">Rudra Mohanty</p>
              <p className="text-gray-400 text-xs">Investor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-300 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col h-full pt-0">

          {/* Navigation */}
          <nav className="flex-1 px-4 pt-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                        ${isActive
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                        }
                      `}
                      style={isActive ? { backgroundColor: 'var(--sidebar-hover)' } : {}}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Settings */}
          <div className="p-4">
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              <Settings className="mr-3 w-5 h-5" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;