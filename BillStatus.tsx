import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { calculateBillStatus } from '../utils/bills';
import { Bill } from '../types';
import { AlertTriangle, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface BillStatusProps {
  bills: Bill[];
  onAddBill: () => void;
}

export function BillStatus({ bills, onAddBill }: BillStatusProps) {
  const billStatus = calculateBillStatus(bills);
  
  const overdueBills = billStatus.categorized.filter(b => b.status === 'overdue');
  const upcomingBills = billStatus.categorized.filter(b => b.status === 'upcoming');
  const unpaidBills = billStatus.categorized.filter(b => b.status === 'unpaid');
  const paidBills = billStatus.categorized.filter(b => b.status === 'paid');

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Bill Tracker</CardTitle>
          <Button onClick={onAddBill} size="sm" variant="outline">
            Add Bill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Overdue */}
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-medium text-rose-700">Overdue</span>
            </div>
            <p className="text-2xl font-bold text-rose-700">
              ${billStatus.overdue.toFixed(2)}
            </p>
            <p className="text-xs text-rose-600 mt-1">
              {overdueBills.length} bill{overdueBills.length !== 1 ? 's' : ''} overdue
            </p>
          </div>

          {/* Upcoming */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Upcoming</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              ${billStatus.upcoming.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {upcomingBills.length} bill{upcomingBills.length !== 1 ? 's' : ''} coming
            </p>
          </div>

          {/* Unpaid */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Due Soon</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">
              ${billStatus.unpaid.toFixed(2)}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              {unpaidBills.length} bill{unpaidBills.length !== 1 ? 's' : ''} due this week
            </p>
          </div>

          {/* Paid */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Paid</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">
              ${billStatus.paid.toFixed(2)}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              {paidBills.length} bill{paidBills.length !== 1 ? 's' : ''} paid
            </p>
          </div>
        </div>

        {/* Recent Bills List */}
        {billStatus.categorized.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Recent Bills</h4>
            {billStatus.categorized.slice(0, 5).map((bill) => {
              const statusColors = {
                paid: 'bg-emerald-100 text-emerald-700',
                unpaid: 'bg-amber-100 text-amber-700',
                overdue: 'bg-rose-100 text-rose-700',
                upcoming: 'bg-blue-100 text-blue-700',
              };

              return (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[bill.status]}`}>
                      {bill.status}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{bill.name}</p>
                      <p className="text-xs text-slate-500">
                        Due: {new Date(bill.dueDate).toLocaleDateString()}
                        {bill.daysUntilDue !== undefined && bill.status !== 'paid' && (
                          <span className="ml-2">
                            {bill.daysUntilDue < 0
                              ? `${Math.abs(bill.daysUntilDue)} days ago`
                              : bill.daysUntilDue === 0
                              ? 'Today'
                              : `in ${bill.daysUntilDue} days`}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${bill.amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No bills added yet</p>
            <Button onClick={onAddBill} size="sm" variant="link" className="mt-2">
              Add your first bill
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}