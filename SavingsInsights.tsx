import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { generateInsights } from '../utils/insights';
import { Transaction } from '../types';
import { Lightbulb, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface SavingsInsightsProps {
  transactions: Transaction[];
}

export function SavingsInsights({ transactions }: SavingsInsightsProps) {
  const insights = generateInsights(transactions);
  
  const getIcon = (type: 'tip' | 'warning' | 'success') => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
  };
  
  const getBgColor = (type: 'tip' | 'warning' | 'success') => {
    switch (type) {
      case 'tip':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'success':
        return 'bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getBgColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-slate-800 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-600">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Add transactions to get personalized insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}