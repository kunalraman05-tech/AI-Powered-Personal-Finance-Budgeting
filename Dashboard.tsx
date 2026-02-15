import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BudgetSummary, Currency } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Star, Upload, Download, User } from 'lucide-react';

interface DashboardProps {
  summary: BudgetSummary;
  currency: Currency;
}

export function Dashboard({ summary, currency }: DashboardProps) {
  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getProgressBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-emerald-100';
      case 'warning':
        return 'bg-amber-100';
      case 'danger':
        return 'bg-red-100';
      default:
        return 'bg-slate-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Layout Container */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Income</CardTitle>
            <Upload className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.totalIncome, currency)}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Expenses</CardTitle>
            <Download className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses, currency)}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Remaining Balance</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(summary.balance, currency)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Budget Used</span>
              <span className="font-semibold">{summary.percentage.toFixed(0)}%</span>
            </div>
            <div className={`h-3 rounded-full ${getProgressBg(summary.status)}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(summary.status)}`}
                style={{ width: `${Math.min(summary.percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {summary.status === 'good' && 'You are within your budget. Keep it up!'}
              {summary.status === 'warning' && 'Approaching budget limit. Consider reducing expenses.'}
              {summary.status === 'danger' && 'Over budget! Review your spending immediately.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}