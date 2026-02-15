import { Transaction } from '../types';

export interface WeeklyCashFlow {
  week: string;
  income: number;
  expenses: number;
  net: number;
}

export const getWeeklyCashFlow = (transactions: Transaction[] | undefined): WeeklyCashFlow[] => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const weeks: Record<string, WeeklyCashFlow> = {};

  transactions.forEach(t => {
    const date = new Date(t.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        week: weekLabel,
        income: 0,
        expenses: 0,
        net: 0,
      };
    }

    if (t.type === 'income') {
      weeks[weekKey].income += t.amount;
    } else {
      weeks[weekKey].expenses += t.amount;
    }

    weeks[weekKey].net = weeks[weekKey].income - weeks[weekKey].expenses;
  });

  return Object.values(weeks).sort((a, b) => {
    const dateA = new Date(a.week);
    const dateB = new Date(b.week);
    return dateB.getTime() - dateA.getTime();
  });
};