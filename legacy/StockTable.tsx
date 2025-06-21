// 'use client';

// import React, { useState, useEffect } from 'react';
// import { CurrentPrice, CurrentPriceService } from '@/lib/current_price';

// interface StockTableProps {
//   className?: string;
// }

// export default function StockTable({ className = '' }: StockTableProps) {
//   const [stocks, setStocks] = useState<CurrentPrice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const stocksPerPage = 10;
//   const totalPages = Math.ceil(stocks.length / stocksPerPage);

//   useEffect(() => {
//     const fetchStocks = async () => {
//       try {
//         setLoading(true);
//         const data = await CurrentPriceService.getCurrentPrices();
//         setStocks(data);
//         setError(null);
//       } catch (err) {
//         setError('Failed to fetch stock data');
//         console.error('Error fetching stocks:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStocks();
//   }, []);

//   const getCurrentPageStocks = () => {
//     const startIndex = (currentPage - 1) * stocksPerPage;
//     const endIndex = startIndex + stocksPerPage;
//     return stocks.slice(startIndex, endIndex);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleStockClick = (symbol: string) => {
//     console.log(`Clicked on stock: ${symbol}`);
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(price);
//   };

//   const formatChange = (change: number) => {
//     const sign = change >= 0 ? '+' : '';
//     return `${sign}${formatPrice(change)}`;
//   };

//   const formatPercentChange = (percent: number) => {
//     const sign = percent >= 0 ? '+' : '';
//     return `${sign}${percent.toFixed(2)}%`;
//   };

//   // Helper to remove .NS postfix from symbol
//   const stripPostfix = (symbol: string) => {
//     return symbol.replace(/\.NS$/i, '');
//   };

//   if (loading) {
//     return (
//       <div className={`${className}`}>
//         <div className="flex justify-center items-center py-12">
//           <div className="text-lg" style={{ color: 'var(--foreground)' }}>
//             Loading stocks...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`${className}`}>
//         <div className="flex justify-center items-center py-12">
//           <div className="text-lg text-red-400">{error}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${className}`}>
//       {/* Stock Cards Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
//         {getCurrentPageStocks().map((stock) => (
//           <div
//             key={stock.symbol}
//             onClick={() => handleStockClick(stock.symbol)}
//             className="p-4 rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer hover:scale-[1.02]"
//             style={{
//               backgroundColor: 'var(--sidebar-bg)',
//               borderColor: 'var(--border-color)',
//             }}
//           >
//             <div className="flex justify-between items-center">
//               {/* Left side - Symbol and Company name */}
//               <div className="flex-1 min-w-0">
//                 <div
//                   className="font-bold text-lg mb-1"
//                   style={{ color: 'var(--foreground)' }}
//                 >
//                   {stripPostfix(stock.symbol)}
//                 </div>
//                 <div
//                   className="text-sm text-gray-400 truncate pr-2"
//                   title={stock.companyName}
//                 >
//                   {stock.companyName}
//                 </div>
//               </div>
              
//               {/* Right side - Price and Change */}
//               <div className="flex flex-col items-end text-right">
//                 <div
//                   className="text-xl font-bold mb-1"
//                   style={{ color: 'var(--foreground)' }}
//                 >
//                   ₹{formatPrice(stock.currentPrice)}
//                 </div>
                
//                 <div className="flex items-center space-x-1">
//                   {/* Arrow icon */}
//                   <span className={`text-sm ${stock.Change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
//                     {stock.Change >= 0 ? '▲' : '▼'}
//                   </span>
                  
//                   {/* Change amount and percentage */}
//                   <div
//                     className={`text-sm font-medium ${stock.Change >= 0 ? 'text-green-400' : 'text-red-400'}`}
//                   >
//                     {formatChange(stock.Change)} ({formatPercentChange(stock.PercentChange)})
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center space-x-2">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             style={{
//               backgroundColor: currentPage === 1 ? 'var(--sidebar-bg)' : 'var(--sidebar-hover)',
//               color: 'var(--foreground)',
//               borderColor: 'var(--border-color)',
//             }}
//           >
//             Previous
//           </button>
          
//           {/* Page Numbers */}
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (totalPages <= 5) {
//               pageNum = i + 1;
//             } else if (currentPage <= 3) {
//               pageNum = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i;
//             } else {
//               pageNum = currentPage - 2 + i;
//             }
            
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => handlePageChange(pageNum)}
//                 className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
//                   currentPage === pageNum ? 'opacity-100' : 'opacity-70'
//                 }`}
//                 style={{
//                   backgroundColor: currentPage === pageNum ? 'var(--accent-green)' : 'var(--sidebar-bg)',
//                   color: 'var(--foreground)',
//                 }}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
          
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             style={{
//               backgroundColor: currentPage === totalPages ? 'var(--sidebar-bg)' : 'var(--sidebar-hover)',
//               color: 'var(--foreground)',
//             }}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { CurrentPrice, CurrentPriceService } from '@/lib/current_price';

interface StockTableProps {
  className?: string;
}

export default function StockTable({ className = '' }: StockTableProps) {
  const [stocks, setStocks] = useState<CurrentPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 8;
  const totalPages = Math.ceil(stocks.length / stocksPerPage);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const data = await CurrentPriceService.getCurrentPrices();
        setStocks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const getCurrentPageStocks = () => {
    const startIndex = (currentPage - 1) * stocksPerPage;
    const endIndex = startIndex + stocksPerPage;
    return stocks.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStockClick = (symbol: string) => {
    console.log(`Clicked on stock: ${symbol}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(change)}`;
  };

  const formatPercentChange = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  // Helper to remove .NS postfix from symbol
  const stripPostfix = (symbol: string) => {
    return symbol.replace(/\.NS$/i, '');
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg" style={{ color: 'var(--foreground)' }}>
            Loading stocks...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Stock Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {/* <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Symbol
              </th> */}
              <th
                className="text-left py-3 px-4 font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Company Name
              </th>
              <th
                className="text-right py-3 px-4 font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Price (₹)
              </th>
              <th
                className="text-right py-3 px-4 font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Change
              </th>
              <th
                className="text-right py-3 px-4 font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Change %
              </th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageStocks().map((stock, index) => (
              <tr
                key={stock.symbol}
                onClick={() => handleStockClick(stock.symbol)}
                className="border-b hover:bg-opacity-50 cursor-pointer transition-colors duration-200"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--sidebar-bg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'var(--sidebar-bg)';
                }}
              >
                {/* <td className="py-3 px-4">
                  <div
                    className="font-bold text-base"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {stripPostfix(stock.symbol)}
                  </div>
                </td> */}
                <td className="py-3 px-4">
                  <div
                    className="text-sm text-gray-100 max-w-xs truncate"
                    title={stock.companyName}
                  >
                    {stock.companyName}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div
                    className="text-base font-semibold text-gray-100"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {formatPrice(stock.currentPrice)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div
                    className={`text-sm font-medium flex items-center justify-end ${
                      stock.Change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    <span className="mr-1">
                      {stock.Change >= 0 ? '▲' : '▼'}
                    </span>
                    {formatChange(stock.Change)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div
                    className={`text-sm font-medium ${
                      stock.Change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {formatPercentChange(stock.PercentChange)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: currentPage === 1 ? 'var(--sidebar-bg)' : 'var(--sidebar-hover)',
              color: 'var(--foreground)',
              borderColor: 'var(--border-color)',
            }}
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === pageNum ? 'opacity-100' : 'opacity-70'
                }`}
                style={{
                  backgroundColor: currentPage === pageNum ? 'var(--accent-green)' : 'var(--sidebar-bg)',
                  color: 'var(--foreground)',
                }}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: currentPage === totalPages ? 'var(--sidebar-bg)' : 'var(--sidebar-hover)',
              color: 'var(--foreground)',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}