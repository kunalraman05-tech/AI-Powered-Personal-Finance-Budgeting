import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Transaction, Currency } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { getCategoryColor } from '../utils/categories';
import { Trash2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  currency: Currency;
}

export function TransactionList({ transactions, onDelete, currency }: TransactionListProps) {
  const recentTransactions = transactions.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors ${
                  transaction.isForecast ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getCategoryColor(transaction.category)} flex items-center justify-center`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-5 w-5 text-white" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{transaction.category}</p>
                      {transaction.isForecast && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Calendar className="h-3 w-3" />
                          Forecast
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(transaction.id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}