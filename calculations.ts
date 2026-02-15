import { Transaction, Currency, CategorySpending, BudgetSummary, CashFlowData } from '../types';
import { getCategoryColor } from './categories';

export function calculateBudgetSummary(transactions: Transaction[]): BudgetSummary {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;
  const percentage = income > 0 ? (expenses / income) * 100 : 0;

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance,
    percentage,
    status: percentage >= 90 ? 'danger' : percentage >= 80 ? 'warning' : 'good'
  };
}

export function calculateCashFlow(transactions: Transaction[]): CashFlowData[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const flow: CashFlowData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().slice(0, 10);
    
    const dayIncome = transactions
      .filter(t => t.date === dayStr && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const dayExpense = transactions
      .filter(t => t.date === dayStr && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    flow.push({
      date: dayStr,
      income: dayIncome,
      expenses: dayExpense,
      net: dayIncome - dayExpense
    });
  }

  return flow;
}

export function calculateCategorySpending(transactions: Transaction[]): CategorySpending[] {
  const map = new Map<string, number>();
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });

  const totalSpending = Array.from(map.values()).reduce((sum, amount) => sum + amount, 0);

  return Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
      color: getCategoryColor(category)
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function formatCurrency(amount: number, currency: Currency): string {
  const validCurrency = currency && typeof currency === 'string' ? currency : 'USD';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
    }).format(amount);
  } catch (error) {
    return `${validCurrency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function generateInsights(transactions: Transaction[], currency: Currency): string[] {
  const insights: string[] = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');
  
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome > 0) {
    const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
    if (savingsRate > 20) {
      insights.push(`Great job! You're saving ${savingsRate.toFixed(0)}% of your income.`);
    } else if (savingsRate < 0) {
      insights.push(`Warning: You're spending more than you earn this month.`);
    } else {
      insights.push(`You are saving ${savingsRate.toFixed(0)}% of your income.`);
    }
  } else if (totalExpense > 0) {
    insights.push("Add some income transactions to track your savings rate.");
  }

  const categoryMap = new Map<string, number>();
  expenses.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });
  
  const sortedCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1]);
  
  if (sortedCategories.length > 0) {
    const topCategory = sortedCategories[0];
    const percentage = totalExpense > 0 ? (topCategory[1] / totalExpense) * 100 : 0;
    insights.push(`Your highest spending category is ${topCategory[0]} (${formatCurrency(topCategory[1], currency)}), which is ${percentage.toFixed(0)}% of total expenses.`);
  }

  if (insights.length === 0) {
    insights.push("Add more transactions to see personalized insights.");
  }

  return insights;
}