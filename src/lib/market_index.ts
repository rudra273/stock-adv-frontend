// src/lib/market_index.ts
import { apiClient } from './api';


export interface MarketSentiment {
 id: number;
 source: string;
 score: number;
 rating: string;
 last_updated: string;
 created_at: string;
}


export class MarketIndexService {
 /**
  * Fetch market sentiment data from single API endpoint
  */
 static async getMarketSentiment(): Promise<MarketSentiment[]> {
   try {
     const response = await apiClient.get<MarketSentiment[]>('/market-sentiment/index');
     return response;
   } catch (error) {
     console.error('Failed to fetch market sentiment:', error);
     throw new Error('Unable to fetch market sentiment data');
   }
 }


 /**
  * Get sentiment rating color based on score
  */
 static getSentimentColor(score: number): string {
   if (score >= 75) return 'var(--success-color)';
   if (score >= 50) return 'var(--warning-color)';
   return 'var(--error-color)';
 }
}


export default MarketIndexService;