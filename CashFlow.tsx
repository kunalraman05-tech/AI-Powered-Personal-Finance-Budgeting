import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CashFlowData } from '../types';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface CashFlowProps {
  cashFlow: CashFlowData[];
}

export function CashFlow({ cashFlow }: CashFlowProps) {
  const chartData = cashFlow.map(item => ({
    day: format(new Date(item.date), 'EEE'),
    income: item.income,
    expenses: item.expenses,
    net: item.net,
  }));

  const totalIncome = cashFlow.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = cashFlow.reduce((sum, item) => sum + item.expenses, 0);
  const avgDailyNet = cashFlow.length > 0 
    ? cashFlow.reduce((sum, item) => sum + item.net, 0) / cashFlow.length 
    : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Cash Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cashFlow.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No cash flow data yet</p>
            <p className="text-xs mt-1">Add transactions to see trends</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-lg p-3 text-center">
                <p className="text-xs text-emerald-600 font-medium">Total In</p>
                <p className="text-lg font-bold text-emerald-700">${totalIncome.toFixed(0)}</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-3 text-center">
                <p className="text-xs text-rose-600 font-medium">Total Out</p>
                <p className="text-lg font-bold text-rose-700">${totalExpenses.toFixed(0)}</p>
              </div>
              <div className={`rounded-lg p-3 text-center ${avgDailyNet >= 0 ? 'bg-blue-50' : 'bg-rose-50'}`}>
                <p className={`text-xs font-medium ${avgDailyNet >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>Avg Daily</p>
                <p className={`text-lg font-bold ${avgDailyNet >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                  ${avgDailyNet.toFixed(0)}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number, name: string) => [
                      `$${value.toFixed(2)}`,
                      name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net'
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="income" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    name="Income"
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="#f43f5e" 
                    radius={[4, 4, 0, 0]}
                    name="Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <TrendingUp className="w-4 h-4" />
              <span>
                {avgDailyNet >= 0 
                  ? 'Positive cash flow trend' 
                  : 'Negative cash flow - review spending'}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}