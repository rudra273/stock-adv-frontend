// src/lib/financials.ts

import { apiClient } from './api';

export interface BalanceSheet {
  symbol: string;
  Date: string; // ISO date string
  total_assets?: number;
  total_debt?: number;
  stockholders_equity?: number;
  cash_and_cash_equivalents?: number;
}

export interface IncomeStatement {
  symbol: string;
  Date: string; // ISO date string
  total_revenue?: number;
  gross_profit?: number;
  operating_income?: number;
  net_income?: number;
  basic_eps?: number;
  diluted_eps?: number;
}

export class FinancialsService {
  /**
   * Fetch balance sheet for a specific stock symbol
   */
  static async getBalanceSheet(symbol: string): Promise<BalanceSheet[]> {
    try {
      const response = await apiClient.get<BalanceSheet[]>(`/stocks/balance-sheet/${symbol}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch balance sheet for symbol ${symbol}:`, error);
      throw new Error(`Unable to fetch balance sheet for symbol ${symbol}`);
    }
  }

  /**
   * Fetch income statement for a specific stock symbol
   */
  static async getIncomeStatement(symbol: string): Promise<IncomeStatement[]> {
    try {
      const response = await apiClient.get<IncomeStatement[]>(`/stocks/income-statement/${symbol}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch income statement for symbol ${symbol}:`, error);
      throw new Error(`Unable to fetch income statement for symbol ${symbol}`);
    }
  }
}

export default FinancialsService;
