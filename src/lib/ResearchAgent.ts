import { apiClient } from './api';

export interface ResearchAgentResponse {
  symbol: string;
  company_name: string;
  stock_summary: string;
  market_summary: string;
  overall_summary: string;
  sources: {
    domains: string[];
    urls: string[];
    api_sources: string[];
  };
}

export class ResearchAgentService {
  /**
   * Fetch research agent analysis for a given stock symbol
   * @param symbol Stock symbol (e.g., "TCS.NS")
   */
  static async getResearchAgent(symbol: string): Promise<ResearchAgentResponse> {
    try {
      const response = await apiClient.get<ResearchAgentResponse>(`/agents/research_agent/${symbol}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch research agent data:', error);
      throw new Error('Unable to fetch research agent data');
    }
  }
}
