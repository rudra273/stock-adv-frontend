import { apiClient } from './api';

export interface NewsItem {
  url: string;
  symbol: string;
  source_name: string;
  title: string;
  description: string;
  content: string;
  published_at: string;
  sentiment: string;
  sentiment_reason: string;
}

export class NewsService {
  /**
   * Fetch all news items
   */
  static async getAllNews(): Promise<NewsItem[]> {
    try {
      const response = await apiClient.get<NewsItem[]>('/news/all');
      return response;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      throw new Error('Unable to fetch news');
    }
  }
}
