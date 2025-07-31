import { apiClient } from './api';

export interface IndexInfo {
  symbol: string;
  shortName: string;
  currentPrice: number;
  previousClose: number;
  Change: number;
  PercentChange: number;
}

export class IndexInfoService {
  /**
   * Fetch index information for major indices
   */
  static async getIndexInfo(): Promise<IndexInfo[]> {
    try {
      const response = await apiClient.get<IndexInfo[]>('/stocks/index-info');
      return response;
    } catch (error) {
      console.error('Failed to fetch index info:', error);
      throw new Error('Unable to fetch index info');
    }
  }
}
