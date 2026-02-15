import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Transaction, Budget, Currency } from '../types';
import { formatCurrency } from '../utils/calculations';
import { BarChart3, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BudgetComparisonProps {
  transactions: Transaction[];
  budgets: Budget[];
  currency: Currency;
}

type TimeFilter = 'month' | 'year' | 'all';

export function BudgetComparison({ transactions, budgets, currency }: BudgetComparisonProps) {
  const [filter, setFilter] = useState<TimeFilter>('month');

  const filteredData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filteredTxns = transactions.filter(t => {
      const tDate = new Date(t.date);
      if (filter === 'month') {
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      } else if (filter === 'year') {
        return tDate.getFullYear() === currentYear;
      }
      return true; // 'all'
    });

    // Calculate spending per category
    const spendingMap = new Map<string, number>();
    filteredTxns.forEach(t => {
      if (t.type === 'expense' && !t.isForecast) {
        spendingMap.set(t.category, (spendingMap.get(t.category) || 0) + t.amount);
      }
    });

    // Combine with budgets
    return budgets
      .map(budget => {
        const spent = spendingMap.get(budget.category) || 0;
        const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
        return {
          category: budget.category,
          limit: budget.limit,
          spent,
          percentage,
          status: percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'good',
        };
      })
      .filter(item => item.limit > 0) // Only show categories with a budget set
      .sort((a, b) => b.percentage - a.percentage);
  }, [transactions, budgets, filter]);

  const getFilterLabel = (f: TimeFilter) => {
    switch (f) {
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'all': return 'All Time';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Budget vs Actual
          </CardTitle>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-lg mt-2">
          {(['month', 'year', 'all'] as TimeFilter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
              className={`flex-1 ${filter === f ? 'shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {getFilterLabel(f)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No budgets set yet</p>
            <p className="text-xs mt-1">Set up budgets in the Budget Setup section</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredData.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    {item.status === 'danger' && (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    {item.status === 'good' && item.spent > 0 && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${item.status === 'danger' ? 'text-red-600' : 'text-slate-900'}`}>
                      {formatCurrency(item.spent, currency)}
                    </span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-slate-500">{formatCurrency(item.limit, currency)}</span>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                  {/* Background marker for 100% budget */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-slate-300 left-full" />
                  
                  {/* Actual Spending Bar */}
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'danger' ? 'bg-red-500' : 
                      item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>

                {/* Percentage Text */}
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">
                    {item.percentage.toFixed(0)}% used
                  </span>
                  <span className={item.status === 'danger' ? 'text-red-500 font-medium' : 'text-slate-500'}>
                    {item.limit - item.spent >= 0 
                      ? `${formatCurrency(item.limit - item.spent, currency)} remaining`
                      : `${formatCurrency(Math.abs(item.limit - item.spent), currency)} over budget`
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}