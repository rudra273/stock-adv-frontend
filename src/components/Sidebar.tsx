// // components/Sidebar.tsx

// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';
// import { LineChart, Search, BarChart2, BookOpen, Settings, LayoutDashboard, X } from 'lucide-react';
// import { Bookmark } from 'lucide-react';

// const Sidebar = () => {
//   const pathname = usePathname();
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="mr-3 w-5 h-5" /> },
//     { name: 'Watchlists', href: '/watchlists', icon: <Bookmark className="mr-3 w-5 h-5" /> },
//     { name: 'Research', href: '/research', icon: <Search className="mr-3 w-5 h-5" /> },
//     { name: 'Compare', href: '/compare', icon: <BarChart2 className="mr-3 w-5 h-5" /> },
//     { name: 'Learn', href: '/learn', icon: <BookOpen className="mr-3 w-5 h-5" /> },
//   ];

//   const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

//   return (
//     <>
//       {/* Mobile Menu Opener Button - Only shows when menu is closed */}
//       {!isMobileOpen && (
//         <button
//           onClick={toggleMobile}
//           className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-white"
//           style={{ backgroundColor: 'var(--sidebar-bg)' }}
//           aria-label="Open menu"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>
//       )}

//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/30 z-30"
//           onClick={toggleMobile}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed top-0 left-0 z-40 h-full w-64
//           transform transition-transform duration-300 ease-in-out
//           lg:translate-x-0 lg:static lg:z-auto
//           ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}
//         style={{ backgroundColor: 'var(--sidebar-bg)' }}
//       >
//         {/* NEW: Close button placed INSIDE the sidebar */}
//         <button
//           onClick={toggleMobile}
//           className="lg:hidden absolute top-4 right-4 p-1 text-gray-300 hover:text-white"
//           aria-label="Close menu"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="p-6">
//             <Link href="/" className="flex items-center space-x-2 group">
//               <LineChart className="w-7 h-7 text-green-500 group-hover:text-green-400 transition-colors" />
//               <span className="text-xl font-bold text-white">StockSavvy</span>
//             </Link>
//             <p className="text-sm text-gray-400 mt-1">AI-Powered Stock Advisory</p>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4">
//             <ul className="space-y-1">
//               {navigation.map((item) => {
//                 const isActive = pathname === item.href;
//                 return (
//                   <li key={item.name}>
//                     <Link
//                       href={item.href}
//                       onClick={() => setIsMobileOpen(false)}
//                       className={`
//                         flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
//                         ${isActive 
//                           ? 'text-white' 
//                           : 'text-gray-300 hover:text-white'
//                         }
//                       `}
//                       style={isActive ? { backgroundColor: 'var(--sidebar-hover)' } : {}}
//                     >
//                       {item.icon}
//                       {item.name}
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* Settings */}
//           <div className="p-4">
//             <Link
//               href="/settings"
//               className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
//             >
//               <Settings className="mr-3 w-5 h-5" />
//               Settings
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

// components/Sidebar.tsx

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
        {/* Close button - only visible on mobile when open */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1 text-gray-300 hover:text-white"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col h-full pt-16 lg:pt-6">
          {/* Navigation */}
          <nav className="flex-1 px-4">
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