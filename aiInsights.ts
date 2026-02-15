import { Transaction, Currency, AIInsight } from '../types';
import { formatCurrency } from './calculations';

export function generateAIInsights(transactions: Transaction[], currency: Currency): AIInsight[] {
  const insights: AIInsight[] = [];
  const expenses = transactions.filter(t => t.type === 'expense' && !t.isForecast);
  const income = transactions.filter(t => t.type === 'income' && !t.isForecast);

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // ==========================================
  // KEY FINANCIAL RATIOS (AI Powered Insights)
  // ==========================================

  // 1. Savings Rate Ratio
  // Rule of Thumb: Aim for >20%
  if (totalIncome > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    let status: 'success' | 'warning' | 'danger' = 'success';
    let message = '';
    
    if (savingsRate >= 20) {
      message = `Excellent! Your savings rate is ${savingsRate.toFixed(1)}%. You are building wealth efficiently.`;
      status = 'success';
    } else if (savingsRate >= 10) {
      message = `Your savings rate is ${savingsRate.toFixed(1)}%. Good progress, but aim for 20% to accelerate goals.`;
      status = 'warning';
    } else if (savingsRate > 0) {
      message = `Your savings rate is low (${savingsRate.toFixed(1)}%). Try to reduce non-essential spending to boost this.`;
      status = 'warning';
    } else {
      message = `You are spending more than you earn. Immediate budget correction is required.`;
      status = 'danger';
    }

    insights.push({
      id: 'ratio-savings',
      type: 'health',
      title: 'Savings Rate Ratio',
      message: message,
      icon: 'TrendingUp',
      severity: status === 'danger' ? 'high' : status === 'warning' ? 'medium' : 'low',
      actionable: status !== 'success',
    });
  }

  // 2. Essential Expenses Ratio (The 50/30/20 Rule - Needs)
  // Categories: Rent, Utilities, Groceries, Health, Transportation
  // Rule of Thumb: Keep under 50% of income
  const essentialCategories = ['Rent', 'Utilities', 'Groceries', 'Health', 'Transportation'];
  const essentialSpending = expenses
    .filter(t => essentialCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (totalIncome > 0) {
    const essentialRatio = (essentialSpending / totalIncome) * 100;
    let status = 'success';
    let message = '';

    if (essentialRatio > 60) {
      message = `Essential costs consume ${essentialRatio.toFixed(1)}% of income. This is high; consider housing or utility adjustments.`;
      status = 'danger';
    } else if (essentialRatio > 50) {
      message = `Essential costs are ${essentialRatio.toFixed(1)}% of income. You are slightly over the recommended 50% limit.`;
      status = 'warning';
    } else {
      message = `Essential costs are ${essentialRatio.toFixed(1)}% of income. You are well within the healthy 50% range.`;
      status = 'success';
    }

    insights.push({
      id: 'ratio-essential',
      type: 'optimization',
      title: 'Essential Expenses Ratio',
      message: message,
      icon: 'Target',
      severity: status === 'danger' ? 'high' : status === 'warning' ? 'medium' : 'low',
      actionable: status !== 'success',
    });
  }

  // 3. Discretionary Spending Ratio (The 50/30/20 Rule - Wants)
  // Categories: Entertainment, Dining, Shopping
  // Rule of Thumb: Keep under 30% of income
  const discretionaryCategories = ['Entertainment', 'Dining', 'Shopping'];
  const discretionarySpending = expenses
    .filter(t => discretionaryCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome > 0) {
    const discretionaryRatio = (discretionarySpending / totalIncome) * 100;
    let status = 'success';
    let message = '';

    if (discretionaryRatio > 40) {
      message = `Lifestyle inflation detected. ${discretionaryRatio.toFixed(1)}% of income goes to wants. Cut back to hit 30%.`;
      status = 'warning';
    } else if (discretionaryRatio > 30) {
      message = `Discretionary spending is ${discretionaryRatio.toFixed(1)}%. You are slightly over the 30% guideline.`;
      status = 'warning';
    } else {
      message = `Discretionary spending is ${discretionaryRatio.toFixed(1)}%. You have good control over your "wants".`;
      status = 'success';
    }

    insights.push({
      id: 'ratio-discretionary',
      type: 'pattern',
      title: 'Discretionary Spending',
      message: message,
      icon: 'Zap',
      severity: status === 'warning' ? 'medium' : 'low',
      actionable: status === 'warning',
    });
  }

  // ==========================================
  // EXISTING ANOMALY DETECTION
  // ==========================================

  const categoryMap = new Map<string, number[]>();
  expenses.forEach(t => {
    if (!categoryMap.has(t.category)) categoryMap.set(t.category, []);
    categoryMap.get(t.category)!.push(t.amount);
  });

  categoryMap.forEach((amounts, category) => {
    if (amounts.length < 2) return;
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const max = Math.max(...amounts);
    
    if (max > avg * 2) {
      insights.push({
        id: `anomaly-${category}`,
        type: 'anomaly',
        title: `Unusual Spending in ${category}`,
        message: `You spent ${formatCurrency(max, currency)} on ${category}, which is significantly higher than your average of ${formatCurrency(avg, currency)}.`,
        icon: 'AlertTriangle',
        severity: 'high',
        actionable: true,
      });
    }
  });

  // ==========================================
  // EXISTING PATTERN RECOGNITION
  // ==========================================

  const dateMap = new Map<string, number>();
  expenses.forEach(t => {
    const day = new Date(t.date).getDate();
    const key = `${t.category}-${day}`;
    dateMap.set(key, (dateMap.get(key) || 0) + 1);
  });

  dateMap.forEach((count, key) => {
    if (count >= 2) {
      const [category] = key.split('-');
      insights.push({
        id: `pattern-${key}`,
        type: 'pattern',
        title: `Recurring Pattern Detected`,
        message: `You have transactions in "${category}" on the same day of the month multiple times. Consider setting this up as a recurring bill.`,
        icon: 'Repeat',
        severity: 'low',
        actionable: true,
      });
    }
  });

  // ==========================================
  // EXISTING PREDICTIVE ANALYSIS
  // ==========================================

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysPassed = today.getDate();
  const daysLeft = daysInMonth - daysPassed;

  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
  const dailyBurnRate = daysPassed > 0 ? totalSpent / daysPassed : 0;
  const projectedSpend = totalSpent + (dailyBurnRate * daysLeft);
  
  if (daysPassed > 5) {
    if (projectedSpend > totalIncome && totalIncome > 0) {
      insights.push({
        id: 'prediction-overspend',
        type: 'prediction',
        title: 'Month-End Projection',
        message: `At your current burn rate, you're projected to spend ${formatCurrency(projectedSpend, currency)} by month-end, exceeding your income.`,
        icon: 'TrendingDown',
        severity: 'high',
        actionable: true,
      });
    } else if (projectedSpend < totalIncome * 0.8 && totalIncome > 0) {
      insights.push({
        id: 'prediction-underspend',
        type: 'prediction',
        title: 'On Track for Savings',
        message: `Projected month-end spend is ${formatCurrency(projectedSpend, currency)}. You are in a safe position.`,
        icon: 'TrendingUp',
        severity: 'low',
        actionable: false,
      });
    }
  }

  // ==========================================
  // EXISTING OPTIMIZATION
  // ==========================================

  const sortedCategories = Array.from(categoryMap.entries())
    .map(([cat, amounts]) => ({ category: cat, total: amounts.reduce((a, b) => a + b, 0) }))
    .sort((a, b) => b.total - a.total);

  if (sortedCategories.length > 0) {
    const topCategory = sortedCategories[0];
    const potentialSavings = topCategory.total * 0.2;
    
    insights.push({
      id: 'optimization-cut',
      type: 'optimization',
      title: `Optimize ${topCategory.category}`,
      message: `Reducing your ${topCategory.category} spending by 20% could save you ${formatCurrency(potentialSavings, currency)}.`,
      icon: 'Target',
      severity: 'medium',
      actionable: true,
    });
  }

  return insights.slice(0, 5);
}