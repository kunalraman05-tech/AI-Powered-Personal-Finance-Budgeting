import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { calculateRatios } from '../utils/calculations';
import { Transaction } from '../types';
import { PieChart, Activity, Target, TrendingUp } from 'lucide-react';

interface FinancialRatiosProps {
  transactions: Transaction[];
}

export function FinancialRatios({ transactions }: FinancialRatiosProps) {
  const ratios = calculateRatios(transactions);
  
  const getStatusColor = (status: 'good' | 'warning' | 'bad') => {
    switch (status) {
      case 'good':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'bad':
        return 'text-rose-600 bg-rose-50 border-rose-200';
    }
  };
  
  const getStatusIcon = (status: 'good' | 'warning' | 'bad') => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'bad':
        return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Financial Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ratios.length > 0 ? (
          <div className="space-y-4">
            {ratios.map((ratio, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-slate-800">{ratio.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ratio.status)}`}>
                        {ratio.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{ratio.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {ratio.value.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-500">Target: {ratio.target}%</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                      ratio.status === 'good' ? 'bg-emerald-500' :
                      ratio.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(ratio.value, 100)}%` }}
                  />
                </div>
                
                {/* Tip */}
                <p className="text-xs text-slate-600 mt-2 flex items-start gap-1">
                  <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {ratio.tip}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Add income and expenses to see your ratios</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}