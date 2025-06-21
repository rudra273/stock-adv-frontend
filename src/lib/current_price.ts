// src/lib/current_price.ts

import { apiClient } from './api';

export interface CurrentPrice {
  symbol: string;
  companyName: string;
  currentPrice: number;
  previousClose: number;
  Change: number;
  PercentChange: number;
}

export class CurrentPriceService {
  /**
   * Fetch current stock prices from API endpoint
   */
  static async getCurrentPrices(): Promise<CurrentPrice[]> {
    try {
      const response = await apiClient.get<CurrentPrice[]>('/stocks/current-prices');
      return response;
    } catch (error) {
      console.error('Failed to fetch current prices:', error);
      throw new Error('Unable to fetch current prices');
    }
  }

  /**
   * Fetch current price for a specific stock symbol
   */
  static async getCurrentPriceForSymbol(symbol: string): Promise<CurrentPrice> {
    try {
      const response = await apiClient.get<CurrentPrice>(`/stocks/current-prices/${symbol}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch current price for symbol ${symbol}:`, error);
      throw new Error(`Unable to fetch current price for symbol ${symbol}`);
    }
  }
}

export default CurrentPriceService; 
