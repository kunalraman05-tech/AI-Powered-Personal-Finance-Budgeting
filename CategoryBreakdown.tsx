import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CategorySpending, Currency } from '../types';
import { formatCurrency } from '../utils/calculations';
import { PieChart } from 'lucide-react';

interface CategoryBreakdownProps {
  spending: CategorySpending[];
  currency: Currency;
}

export function CategoryBreakdown({ spending, currency }: CategoryBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {spending.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <PieChart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No expenses yet</p>
            <p className="text-xs mt-1">Add expenses to see breakdown</p>
          </div>
        ) : (
          <div className="space-y-4">
            {spending.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-slate-600">{formatCurrency(item.amount, currency)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 text-right">{item.percentage.toFixed(1)}%</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}