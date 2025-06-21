import { apiClient } from './api';

export interface DailyPrice {
  symbol: string;
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

export class DailyPriceService {
  /**
   * Fetch daily prices for a given stock symbol
   * @param symbol Stock symbol (e.g., "TCS.NS")
   */
  static async getDailyPrices(symbol: string): Promise<DailyPrice[]> {
    try {
      const response = await apiClient.get<DailyPrice[]>(`/stocks/daily-prices/${symbol}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch daily prices:', error);
      throw new Error('Unable to fetch daily prices');
    }
  }
}

