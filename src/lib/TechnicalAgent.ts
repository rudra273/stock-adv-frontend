import { apiClient } from './api';

export interface TechnicalAgentResponse {
  symbol: string;
  company_name: string;
  current_price: number;
  analysis_date: string;
  executive_summary: {
    overall_sentiment: string;
    llm_generated_thesis: string;
    key_levels: {
      support: number;
      resistance: number;
      confidence: string;
    };
  };
  llm_generated_narrative_analysis: {
    summary: string;
    bullish_outlook: string;
    bearish_outlook: string;
  };
  data_table: Array<{
    category: string;
    metric: string;
    value: string;
    interpretation: string;
  }>;
  raw_technical_data: {
    moving_averages: {
      MA_50: number;
      MA_200: number;
    };
    rsi: number;
    macd: {
      macd: number;
      signal: number;
      histogram: number;
      crossover_date: string | null;
    };
    stochastic: {
      percent_k: number;
      percent_d: number;
    };
    atr: number;
    obv: {
      obv: number;
      obv_trend: string;
    };
    volatility: number;
    support_resistance: {
      support: number;
      resistance: number;
      confidence: string;
    };
  };
}

export class TechnicalAgentService {
  /**
   * Fetch technical agent analysis for a given stock symbol
   * @param symbol Stock symbol (e.g., "TCS.NS")
   */
  static async getTechnicalAgent(symbol: string): Promise<TechnicalAgentResponse> {
    try {
      const response = await apiClient.get<TechnicalAgentResponse>(`/agents/technical_agent/${symbol}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch technical agent data:', error);
      throw new Error('Unable to fetch technical agent data');
    }
  }
}
