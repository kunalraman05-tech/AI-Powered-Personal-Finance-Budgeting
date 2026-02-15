import { Transaction, Budget, AppSettings } from '../types';

const TRANSACTIONS_KEY = 'fintrack_transactions';
const BUDGETS_KEY = 'fintrack_budgets';
const SETTINGS_KEY = 'fintrack_settings';

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
};

export function loadTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (!data) return [];
  
  const transactions = JSON.parse(data);
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  return transactions.filter((t: Transaction) => t.date.startsWith(currentMonth));
}

export function loadAllTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
  const transactions = loadAllTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
  };
  transactions.push(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  return newTransaction;
}

export function deleteTransaction(id: string): void {
  const transactions = loadAllTransactions().filter(t => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function loadBudgets(): Budget[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(BUDGETS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBudgets(budgets: Budget[]): void {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}