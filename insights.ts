import { Transaction, Insight, Currency } from '../types';
import { formatCurrency } from './calculations';

export function generateInsights(transactions: Transaction[], currency: Currency = 'USD'): Insight[] {
  const insights: Insight[] = [];
  
  // Filter only actual expenses for analysis
  const expenses = transactions.filter(t => t.type === 'expense' && !t.isForecast);
  const income = transactions.filter(t => t.type === 'income' && !t.isForecast);
  
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Group by category
  const categoryMap = new Map<string, number>();
  expenses.forEach(t => {
    categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
  });

  const sortedCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1]);

  // Insight 1: Budget Health Check
  if (balance < 0) {
    insights.push({
      id: '1',
      type: 'danger',
      title: 'Over Budget Alert',
      message: `You've spent ${formatCurrency(Math.abs(balance), currency)} more than you earned this month. Review your largest expenses immediately.`,
      icon: 'AlertTriangle',
      actionable: true,
    });
  } else if (totalExpenses > totalIncome * 0.9) {
    insights.push({
      id: '2',
      type: 'warning',
      title: 'Budget Nearly Exhausted',
      message: `You've used ${(totalExpenses / totalIncome * 100).toFixed(0)}% of your income. Consider pausing non-essential spending.`,
      icon: 'TrendingDown',
      actionable: true,
    });
  } else {
    insights.push({
      id: '3',
      type: 'success',
      title: 'Healthy Budget',
      message: `Great job! You have ${formatCurrency(balance, currency)} remaining. Consider saving or investing this surplus.`,
      icon: 'CheckCircle',
      actionable: false,
    });
  }

  // Insight 2: Top Spending Category Analysis
  if (sortedCategories.length > 0) {
    const [topCategory, topAmount] = sortedCategories[0];
    const percentage = (topAmount / totalExpenses) * 100;
    
    if (percentage > 40) {
      insights.push({
        id: '4',
        type: 'warning',
        title: 'High Spending Concentration',
        message: `${topCategory} accounts for ${percentage.toFixed(0)}% of your expenses (${formatCurrency(topAmount, currency)}). Try to reduce this by 10% to save ${formatCurrency(topAmount * 0.1, currency)}.`,
        icon: 'PieChart',
        actionable: true,
      });
    } else if (percentage > 25) {
      insights.push({
        id: '5',
        type: 'tip',
        title: 'Top Spending Category',
        message: `${topCategory} is your biggest expense at ${formatCurrency(topAmount, currency)}. Look for discounts or alternatives in this category.`,
        icon: 'Tag',
        actionable: true,
      });
    }
  }

  // Insight 3: Dining & Entertainment Check
  const diningSpending = categoryMap.get('Dining') || 0;
  const entertainmentSpending = categoryMap.get('Entertainment') || 0;
  const leisureTotal = diningSpending + entertainmentSpending;
  
  if (leisureTotal > totalIncome * 0.15) {
    insights.push({
      id: '6',
      type: 'warning',
      title: 'Leisure Spending Alert',
      message: `You've spent ${formatCurrency(leisureTotal, currency)} on dining and entertainment. Cooking at home and free activities could save you ${formatCurrency(leisureTotal * 0.3, currency)}.`,
      icon: 'Utensils',
      actionable: true,
    });
  }

  // Insight 4: Savings Rate
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  if (savingsRate < 10 && totalIncome > 0) {
    insights.push({
      id: '7',
      type: 'tip',
      title: 'Boost Your Savings',
      message: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20%. Set up automatic transfers to save first.`,
      icon: 'PiggyBank',
      actionable: true,
    });
  } else if (savingsRate >= 20) {
    insights.push({
      id: '8',
      type: 'success',
      title: 'Excellent Savings Rate',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income! This puts you ahead of most people.`,
      icon: 'Star',
      actionable: false,
    });
  }

  // Insight 5: Small Expenses (The "Latte Factor")
  const smallExpenses = expenses.filter(t => t.amount < 20).length;
  if (smallExpenses > 5) {
    insights.push({
      id: '9',
      type: 'tip',
      title: 'Watch Small Purchases',
      message: `You made ${smallExpenses} small purchases under $20. These add up quickly. Track them for a week to see the impact.`,
      icon: 'Coffee',
      actionable: true,
    });
  }

  // Insight 6: Subscription/Recurring Hint
  const utilitiesSpending = categoryMap.get('Utilities') || 0;
  const subscriptionsSpending = categoryMap.get('Shopping') || 0;
  if (utilitiesSpending > 100 || subscriptionsSpending > 100) {
    insights.push({
      id: '10',
      type: 'tip',
      title: 'Review Subscriptions',
      message: 'Check for unused subscriptions or recurring charges. Canceling just one can save $10-30/month.',
      icon: 'RefreshCw',
      actionable: true,
    });
  }

  return insights.slice(0, 4); // Return top 4 most relevant insights
}