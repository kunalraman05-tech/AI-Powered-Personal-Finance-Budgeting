import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AIInsight } from '../types';
import { 
  Sparkles, 
  Zap, 
  Repeat, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Heart, 
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';

interface InsightsPanelProps {
  insights: AIInsight[];
}

const iconMap: Record<string, any> = {
  'Zap': Zap,
  'Repeat': Repeat,
  'TrendingUp': TrendingUp,
  'TrendingDown': TrendingDown,
  'Target': Target,
  'Heart': Heart,
  'AlertTriangle': AlertTriangle,
  'CheckCircle2': CheckCircle2,
  'Info': Info,
};

const getInsightStyles = (type: AIInsight['type'], severity: AIInsight['severity']) => {
  if (type === 'anomaly' || severity === 'high') {
    return {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      title: 'text-rose-800',
    };
  }
  
  if (type === 'optimization' || severity === 'medium') {
    return {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: 'text-amber-800',
    };
  }
  
  if (type === 'health') {
    return {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      title: 'text-pink-800',
    };
  }

  return {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'text-blue-800',
  };
};

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <Card className="h-full border-purple-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Sparkles className="h-5 w-5 animate-pulse" />
          AI Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">Add more transactions to unlock AI insights</p>
            <p className="text-xs mt-1 text-slate-400">We analyze patterns, anomalies, and trends</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => {
              const styles = getInsightStyles(insight.type, insight.severity);
              const Icon = iconMap[insight.icon] || Sparkles;

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
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${styles.title}`}>
                          {insight.title}
                        </h4>
                        {insight.actionable && (
                          <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                            Actionable
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {insight.message}
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