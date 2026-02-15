import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Insight } from '../types';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  TrendingUp, 
  PiggyBank, 
  AlertCircle,
  HelpCircle,
  Zap,
  Calendar,
  Smile
} from 'lucide-react';

interface InsightsProps {
  insights: Insight[];
}

const iconMap: Record<string, any> = {
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'info': Info,
  'tip': Lightbulb,
  'trending-up': TrendingUp,
  'piggy-bank': PiggyBank,
  'alert-circle': AlertCircle,
  'help-circle': HelpCircle,
  'zap': Zap,
  'calendar': Calendar,
  'smile': Smile,
};

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'warning':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        title: 'text-amber-800',
      };
    case 'success':
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        title: 'text-emerald-800',
      };
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: 'text-blue-800',
      };
    case 'tip':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        title: 'text-purple-800',
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-600',
        title: 'text-slate-800',
      };
  }
};

export function Insights({ insights }: InsightsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-500" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">Add transactions to get personalized insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => {
              const styles = getTypeStyles(insight.type);
              const Icon = iconMap[insight.icon] || Lightbulb;

              return (
                <div
                  key={insight.id}
                  className={`${styles.bg} ${styles.border} border rounded-xl p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex gap-3">
                    <div className={`${styles.iconBg} ${styles.iconColor} rounded-lg p-2 flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm ${styles.title} mb-1`}>
                        {insight.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}