import { Transaction } from '../types';

export interface ForecastPrediction {
  category: string;
  predictedAmount: number;
}

export function generateForecastPredictions(transactions: Transaction[]): ForecastPrediction[] {
  // Simple logic: Calculate average expense per category based on history
  const categoryMap = new Map<string, number[]>();
  
  transactions.forEach(t => {
    if (t.type === 'expense') {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, []);
      }
      categoryMap.get(t.category)!.push(t.amount);
    }
  });

  const predictions = Array.from(categoryMap.entries())
    .filter(([_, amounts]) => amounts.length >= 1) 
    .map(([category, amounts]) => {
      const sum = amounts.reduce((a, b) => a + b, 0);
      const avg = sum / amounts.length;
      return {
        category,
        predictedAmount: parseFloat(avg.toFixed(2)),
      };
    });

  return predictions;
}