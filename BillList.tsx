import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Bill, BillStatus } from '../types';
import { updateBill, deleteBill } from '../utils/storage';
import { formatBillDate, getDaysUntilDue, markBillAsPaid } from '../utils/bills';
import { getCategoryColor } from '../utils/categories';
import { Check, Trash2, Calendar, AlertCircle, Clock, DollarSign } from 'lucide-react';

interface BillListProps {
  billStatus: BillStatus;
  onBillUpdated: () => void;
}

export function BillList({ billStatus, onBillUpdated }: BillListProps) {
  const handleMarkAsPaid = (billId: string) => {
    const bills = loadBills();
    const updated = markBillAsPaid(bills, billId);
    saveBills(updated);
    onBillUpdated();
  };

  const handleDelete = (billId: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(billId);
      onBillUpdated();
    }
  };

  const loadBills = () => {
    const data = localStorage.getItem('fintrack_bills');
    return data ? JSON.parse(data) : [];
  };

  const saveBills = (bills: any[]) => {
    localStorage.setItem('fintrack_bills', JSON.stringify(bills));
  };

  const renderBill = (bill: Bill) => {
    const daysUntilDue = getDaysUntilDue(bill.dueDate);
    const isOverdue = bill.status === 'overdue';
    const isToday = daysUntilDue === 0;

    const getStatusBadge = () => {
      if (bill.status === 'paid') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <Check className="w-3 h-3" />
            Paid
          </span>
        );
      } else if (isOverdue) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
            <AlertCircle className="w-3 h-3" />
            Overdue
          </span>
        );
      } else if (isToday) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" />
            Due Today
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Calendar className="w-3 h-3" />
            {daysUntilDue}d left
          </span>
        );
      }
    };

    return (
      <div
        key={bill.id}
        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
          bill.status === 'paid' 
            ? 'bg-emerald-50 border-emerald-200' 
            : isOverdue 
              ? 'bg-rose-50 border-rose-200' 
              : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(bill.category)}`} />
          <div>
            <div className="flex items-center gap-2">
              <p className={`font-medium ${bill.status === 'paid' ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                {bill.name}
              </p>
              {bill.isRecurring && (
                <span className="text-xs text-slate-400">↻</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge()}
              <span className="text-xs text-slate-500">{formatBillDate(bill.dueDate)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`font-semibold ${bill.status === 'paid' ? 'text-slate-400' : 'text-slate-700'}`}>
              ${bill.amount.toFixed(2)}
            </p>
          </div>

          {bill.status !== 'paid' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkAsPaid(bill.id)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 h-8 w-8 p-0"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(bill.id)}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Bills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overdue Bills */}
        {billStatus.overdue.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Overdue ({billStatus.overdue.length})
              </h3>
              <span className="text-sm font-bold text-rose-600">
                ${billStatus.totalOverdue.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              {billStatus.overdue.map(renderBill)}
            </div>
          </div>
        )}

        {/* Upcoming Bills */}
        {billStatus.upcoming.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Upcoming ({billStatus.upcoming.length})
              </h3>
              <span className="text-sm font-bold text-blue-600">
                ${billStatus.totalUpcoming.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              {billStatus.upcoming.map(renderBill)}
            </div>
          </div>
        )}

        {/* Paid Bills */}
        {billStatus.paid.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Paid ({billStatus.paid.length})
              </h3>
              <span className="text-sm font-bold text-emerald-600">
                ${billStatus.totalPaid.toFixed(2)}
              </span>
            </div>
            <div className="space-y-2">
              {billStatus.paid.slice(0, 5).map(renderBill)}
            </div>
          </div>
        )}

        {billStatus.overdue.length === 0 && billStatus.upcoming.length === 0 && billStatus.paid.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No bills yet</p>
            <p className="text-xs mt-1">Add your first bill to start tracking</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}