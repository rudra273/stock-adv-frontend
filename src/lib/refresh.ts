// src/lib/refresh.ts

import { apiClient } from './api';

export async function triggerDailyPrices() {
  return apiClient.post('/ingest/daily');
}

export async function triggerCurrentPrices() {
  return apiClient.post('/ingest/current');
}

export async function triggerStockInfo() {
  return apiClient.post('/ingest/stock-info');
}

export async function triggerBalanceSheet() {
  return apiClient.post('/ingest/balance-sheet');
}

export async function triggerIncomeStatement() {
  return apiClient.post('/ingest/income-statement');
}

export async function triggerCashFlow() {
  return apiClient.post('/ingest/cash-flow');
}

export async function triggerMarketSentiment() {
  return apiClient.post('/ingest/market-sentiment');
}

export async function triggerNews() {
  return apiClient.post('/ingest/news');
}

export async function triggerIndexInfo() {
  return apiClient.post('/ingest/index-info');
}


