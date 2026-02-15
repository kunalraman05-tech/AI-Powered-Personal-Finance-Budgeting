import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, AlertCircle, Coffee, ShieldCheck, BarChart3 } from 'lucide-react';
import { Insight } from '../types';

interface FinancialInsightsProps {
  insights: Insight[];
  savingsRate: number;
  expenseRatio: number;
}

const iconMap: Record<string, any> = {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  AlertCircle,
  Coffee,
  ShieldCheck,
  BarChart3,
  CheckCircle,
};

export function FinancialInsights({ insights, savingsRate, expenseRatio }: FinancialInsightsProps) {
  const getRatioColor = (value: number, isGood: boolean) => {
    if (isGood) return value > 20 ? 'text-green-600' : value > 0 ? 'text-yellow-600' : 'text-red-600';
    return value < 70 ? 'text-green-600' : value < 90 ? 'text-yellow-600' : 'text-red-600';
  };

  const getRatioBg = (value: number, isGood: boolean) => {
    if (isGood) return value > 20 ? 'bg-green-50 border-green-200' : value > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
    return value < 70 ? 'bg-green-50 border-green-200' : value < 90 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-800">AI Financial Insights</h2>
      </div>

      {/* Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Savings Rate Card */}
        <div className={`p-4 rounded-xl border ${getRatioBg(savingsRate, true)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Savings Rate</span>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className={`text-2xl font-bold ${getRatioColor(savingsRate, true)}`}>
            {savingsRate.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {savingsRate >= 20 ? 'Excellent (Goal: >20%)' : 'Needs Improvement'}
          </p>
        </div>

        {/* Expense Ratio Card */}
        <div className={`p-4 rounded-xl border ${getRatioBg(expenseRatio, false)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Expense Ratio</span>
            <TrendingDown className="h-4 w-4 text-slate-400" />
          </div>
          <div className={`text-2xl font-bold ${getRatioColor(expenseRatio, false)}`}>
            {expenseRatio.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {expenseRatio < 70 ? 'Healthy' : expenseRatio < 90 ? 'Caution' : 'Critical'}
          </p>
        </div>
      </div>

      {/* AI Flags List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-700">Smart Analysis</h3>
        
        {insights.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <BarChart3 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Add transactions to see insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => {
              const Icon = iconMap[insight.icon] || AlertCircle;
              
              const bgColors = {
                success: 'bg-green-50 border-green-200',
                warning: 'bg-yellow-50 border-yellow-200',
                danger: 'bg-red-50 border-red-200',
              };

              const iconColors = {
                success: 'text-green-600 bg-green-100',
                warning: 'text-yellow-600 bg-yellow-100',
                danger: 'text-red-600 bg-red-100',
              };

              const badgeColors = {
                success: 'bg-green-100 text-green-700',
                warning: 'bg-yellow-100 text-yellow-700',
                danger: 'bg-red-100 text-red-700',
              };

              return (
                <div 
                  key={insight.id} 
                  className={`p-4 rounded-lg border ${bgColors[insight.type]} flex gap-3 items-start`}
                >
                  <div className={`p-2 rounded-full ${iconColors[insight.type]} shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-800">{insight.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColors[insight.type]}`}>
                        {insight.type === 'success' ? 'Green Flag' : insight.type === 'warning' ? 'Caution' : 'Red Flag'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}