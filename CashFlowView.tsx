import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CashFlowData, ForecastPrediction, Currency } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, TrendingDown, Minus, Sparkles, CheckCircle2 } from 'lucide-react';

interface CashFlowViewProps {
  cashFlow: CashFlowData[];
  predictions: ForecastPrediction[];
  onApplyPredictions: () => void;
  currency: Currency;
}

export function CashFlowView({ cashFlow, predictions, onApplyPredictions, currency }: CashFlowViewProps) {
  const actualIncome = cashFlow.reduce((sum, day) => sum + day.income, 0);
  const actualExpenses = cashFlow.reduce((sum, day) => sum + day.expenses, 0);
  const actualBalance = actualIncome - actualExpenses;
  
  const forecastIncome = predictions.reduce((sum, p) => sum + p.predictedAmount, 0);
  const forecastExpenses = forecastIncome; // Predictions are for expenses
  const forecastBalance = -forecastExpenses;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Cash Flow: Actual vs Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-semibold text-slate-700">Actual (This Month)</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Income</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(actualIncome, currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Expenses</span>
                  <span className="font-semibold text-red-600">{formatCurrency(actualExpenses, currency)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-700">Balance</span>
                  <span className={`font-bold ${actualBalance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                    {formatCurrency(actualBalance, currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-slate-700">Forecast (Planned)</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Planned Income</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(0, currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Planned Expenses</span>
                  <span className="font-semibold text-red-600">{formatCurrency(forecastExpenses, currency)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-700">Net Impact</span>
                  <span className={`font-bold ${forecastBalance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                    {formatCurrency(forecastBalance, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Projected Month-End Balance</p>
                <p className="text-xs text-slate-500 mt-1">If all forecasts are realized</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${(actualBalance + forecastBalance) >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                  {formatCurrency(actualBalance + forecastBalance, currency)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {predictions.length > 0 && (
        <Card className="border-2 border-purple-100 shadow-lg shadow-purple-50">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
              AI Forecast Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <p className="text-sm text-slate-600">
                Based on your spending patterns, here are predicted expenses:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {predictions.map((prediction) => (
                <div
                  key={prediction.category}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-800">{prediction.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{formatCurrency(prediction.predictedAmount, currency)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onApplyPredictions}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Apply Predictions as Forecast
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}