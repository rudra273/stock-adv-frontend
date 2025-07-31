// src/components/Stock/StockGraph.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DailyPrice, DailyPriceService } from '@/lib/DailyPrice';

interface StockGraphProps {
 symbol: string;
}

interface KeyMetrics {
 open: number;
 high: number;
 low: number;
 volume: number;
}

interface PriceChange {
 change: number;
 percentage: number;
 isPositive: boolean;
}

export default function StockGraph({ symbol }: StockGraphProps) {
 const [data, setData] = useState<DailyPrice[]>([]);
 const [filteredData, setFilteredData] = useState<DailyPrice[]>([]);
 const [selectedPeriod, setSelectedPeriod] = useState<'1W' | '1M' | '6M' | '1Y'>('1M');
 const [keyMetrics, setKeyMetrics] = useState<KeyMetrics | null>(null);
 const [priceChange, setPriceChange] = useState<PriceChange | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchData = async () => {
     try {
       setLoading(true);
       const dailyPrices = await DailyPriceService.getDailyPrices(symbol);

       // <<< FIX: Sort the data chronologically (oldest to newest)
       const sortedData = dailyPrices.sort(
         (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
       );

       setData(sortedData);
      
       // Now that the data is sorted, the last item is the latest
       if (sortedData.length > 0) {
         const latest = sortedData[sortedData.length - 1];
         setKeyMetrics({
           open: latest.Open,
           high: latest.High,
           low: latest.Low,
           volume: latest.Volume
         });
       }
     } catch (error) {
       console.error('Error fetching stock data:', error);
     } finally {
       setLoading(false);
     }
   };

   fetchData();
 }, [symbol]);

 useEffect(() => {
   if (data.length === 0) return;

   const now = new Date();
   let startDate: Date;

   switch (selectedPeriod) {
     case '1W':
       startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
       break;
     case '1M':
       startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
       break;
     case '6M':
       startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
       break;
     case '1Y':
       startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
       break;
   }

   const filtered = data.filter(item => {
     const itemDate = new Date(item.Date);
     return itemDate >= startDate;
   });

   setFilteredData(filtered);

   // This calculation will now be correct because `filtered` is also sorted
   if (filtered.length > 1) {
     const startPrice = filtered[0].Close;
     const endPrice = filtered[filtered.length - 1].Close;
     const change = endPrice - startPrice;
     const percentage = (change / startPrice) * 100;
     
     setPriceChange({
       change,
       percentage,
       isPositive: change >= 0
     });
   }
 }, [data, selectedPeriod]);

 const formatVolume = (volume: number) => {
   if (volume >= 1000000) {
     return (volume / 1000000).toFixed(1) + 'M';
   } else if (volume >= 1000) {
     return (volume / 1000).toFixed(1) + 'K';
   }
   return volume.toString();
 };

 const formatXAxisLabel = (value: string) => {
   const date = new Date(value);
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
 };

 // Custom tooltip component
 const CustomTooltip = ({ active, payload, label }: any) => {
   if (active && payload && payload.length) {
     const data = payload[0].payload;
     return (
       <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
         <p className="text-gray-300 text-sm mb-2">
           {new Date(label).toLocaleDateString('en-US', { 
             weekday: 'short', 
             year: 'numeric', 
             month: 'short', 
             day: 'numeric' 
           })}
         </p>
         <div className="space-y-1">
           <p className="text-white"><span className="text-gray-400">Open:</span> ₹{data.Open?.toFixed(2)}</p>
           <p className="text-white"><span className="text-gray-400">High:</span> ₹{data.High?.toFixed(2)}</p>
           <p className="text-white"><span className="text-gray-400">Low:</span> ₹{data.Low?.toFixed(2)}</p>
           <p className="text-white"><span className="text-gray-400">Close:</span> ₹{data.Close?.toFixed(2)}</p>
           <p className="text-white"><span className="text-gray-400">Volume:</span> {formatVolume(data.Volume)}</p>
         </div>
       </div>
     );
   }
   return null;
 };

 if (loading) {
   return (
     <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
       <div className="text-center text-gray-400">Loading chart data...</div>
     </div>
   );
 }

 return (
   <div className="p-2 rounded-lg mb-6" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
     {/* Price Change Indicator */}
     {priceChange && (
       <div className="flex justify-end mb-4">
         <div className="text-right">
           <div className={`text-lg font-semibold ${priceChange.isPositive ? 'text-green-400' : 'text-red-400'}`}>
             {priceChange.isPositive ? '+' : ''}₹{priceChange.change.toFixed(2)}
           </div>
           <div className={`text-sm ${priceChange.isPositive ? 'text-green-400' : 'text-red-400'}`}>
             {priceChange.isPositive ? '+' : ''}{priceChange.percentage.toFixed(2)}% ({selectedPeriod})
           </div>
         </div>
       </div>
     )}

     {/* Chart */}
     <div className="h-64 mb-2 w-full">
       <ResponsiveContainer width="100%" height="100%">
         <AreaChart 
           data={filteredData}
           margin={{ top: 20, right: 5, left: 5, bottom: 20 }}
         >
           <defs>
             <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#a7f3d0" stopOpacity={0.4}/>
               <stop offset="70%" stopColor="#a7f3d0" stopOpacity={0}/>
             </linearGradient>
           </defs>
           <XAxis
             dataKey="Date"
             axisLine={false}
             tickLine={false}
             tick={{ fill: '#9CA3AF', fontSize: 12 }}
             tickFormatter={formatXAxisLabel}
             interval="preserveStartEnd"
           />
           <YAxis
             hide={true}
             domain={['dataMin - 5', 'dataMax + 5']}
           />
           <Tooltip content={<CustomTooltip />} />
           <Area
             type="monotone"
             dataKey="Close"
             stroke="#a7f3d0"
             strokeWidth={2}
             fill="url(#colorGradient)"
             dot={false}
             activeDot={{ r: 4, fill: '#a7f3d0', strokeWidth: 0 }}
           />
         </AreaChart>
       </ResponsiveContainer>
     </div>

     {/* Time Period Selector */}
     <div className="flex justify-center mb-8">
       <div 
         className="flex rounded-full p-0.5 inline-flex"
         style={{ 
           backgroundColor: '#2D4A3A',
         }}
       >
         {(['1W', '1M', '6M', '1Y'] as const).map((period) => (
           <button
             key={period}
             onClick={() => setSelectedPeriod(period)}
             className={`px-4 sm:px-8 lg:px-18 py-0.2 sm:py-0.2 rounded-full text-sm font-medium transition-all duration-200 ${
               selectedPeriod === period
                 ? 'text-white shadow-lg'
                 : 'text-gray-400 hover:text-gray-900'
             }`}
             style={{
               backgroundColor: selectedPeriod === period ? 'var(--sidebar-bg)' : 'transparent',
               color: selectedPeriod === period ? '#ffffff' : undefined,
               minWidth: '50px'
             }}
           >
             {period}
           </button>
         ))}
       </div>
     </div>

     {/* Key Metrics - Responsive Grid */}
     <div>
       <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
         <div 
           className="p-3 sm:p-4 rounded-lg border"
           style={{ 
             backgroundColor: 'rgba(0, 0, 0, 0.2)', 
             borderColor: 'rgba(255, 255, 255, 0.1)' 
           }}
         >
           <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Open</p>
           <p className="text-white text-lg sm:text-xl font-bold">
             ₹{keyMetrics?.open.toFixed(2) || '0.00'}
           </p>
         </div>
         <div 
           className="p-3 sm:p-4 rounded-lg border"
           style={{ 
             backgroundColor: 'rgba(0, 0, 0, 0.2)', 
             borderColor: 'rgba(255, 255, 255, 0.1)' 
           }}
         >
           <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">High</p>
           <p className="text-white text-lg sm:text-xl font-bold">
             ₹{keyMetrics?.high.toFixed(2) || '0.00'}
           </p>
         </div>
         <div 
           className="p-3 sm:p-4 rounded-lg border"
           style={{ 
             backgroundColor: 'rgba(0, 0, 0, 0.2)', 
             borderColor: 'rgba(255, 255, 255, 0.1)' 
           }}
         >
           <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Low</p>
           <p className="text-white text-lg sm:text-xl font-bold">
             ₹{keyMetrics?.low.toFixed(2) || '0.00'}
           </p>
         </div>
         <div 
           className="p-3 sm:p-4 rounded-lg border"
           style={{ 
             backgroundColor: 'rgba(0, 0, 0, 0.2)', 
             borderColor: 'rgba(255, 255, 255, 0.1)' 
           }}
         >
           <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Volume</p>
           <p className="text-white text-lg sm:text-xl font-bold">
             {keyMetrics ? formatVolume(keyMetrics.volume) : '0'}
           </p>
         </div>
       </div>
     </div>
   </div>
 );
}

