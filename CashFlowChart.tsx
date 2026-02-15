import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getWeeklyCashFlow } from '../utils/cashflow';
import { Transaction } from '../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CashFlowChartProps {
  transactions: Transaction[];
}

export function CashFlowChart({ transactions }: CashFlowChartProps) {
  const weeklyData = getWeeklyCashFlow(transactions);
  
  const maxIncome = Math.max(...weeklyData.map(d => d.income), 1);
  const maxExpenses = Math.max(...weeklyData.map(d => d.expenses), 1);
  const maxNet = Math.max(...weeklyData.map(d => Math.abs(d.net)), 1);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Weekly Cash Flow</CardTitle>
      </CardHeader>
      <CardContent>
        {weeklyData.length > 0 ? (
          <div className="space-y-4">
            {weeklyData.map((week, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{week.week}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-600 font-medium">
                      +${week.income.toFixed(0)}
                    </span>
                    <span className="text-rose-600 font-medium">
                      -${week.expenses.toFixed(0)}
                    </span>
                    <span className={`font-semibold ${week.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {week.net >= 0 ? '+' : ''}${week.net.toFixed(0)}
                    </span>
                  </div>
                </div>
                
                {/* Income Bar */}
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(week.income / maxIncome) * 100}%` }}
                  />
                </div>
                
                {/* Expenses Bar */}
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${(week.expenses / maxExpenses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No cash flow data yet</p>
            <p className="text-xs text-slate-400 mt-1">Add transactions to see your weekly trends</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}