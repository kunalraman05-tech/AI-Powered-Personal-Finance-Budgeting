import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Bill } from '../types';
import { loadBills, saveBill, updateBillStatus, deleteBill, calculateBillStatus, getBillsByStatus, getUpcomingBillsAlert } from '../utils/billUtils';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import { formatCurrency, formatDate } from '../utils/calculations';
import { Plus, Trash2, CheckCircle, AlertTriangle, Calendar, Bell } from 'lucide-react';

interface BillTrackerProps {
  onUpdate?: () => void;
}

export function BillTracker({ onUpdate }: BillTrackerProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    dueDate: '',
    isRecurring: false,
  });

  useEffect(() => {
    loadBillsData();
  }, []);

  const loadBillsData = () => {
    const loadedBills = loadBills();
    // Recalculate statuses based on current date
    const updatedBills = loadedBills.map(bill => ({
      ...bill,
      status: calculateBillStatus(bill.dueDate, bill.status),
    }));
    setBills(updatedBills);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBill = saveBill({
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      dueDate: formData.dueDate,
      status: calculateBillStatus(formData.dueDate, 'upcoming'),
      isRecurring: formData.isRecurring,
    });
    setBills([newBill, ...bills]);
    setShowForm(false);
    setFormData({ name: '', amount: '', category: '', dueDate: '', isRecurring: false });
    if (onUpdate) onUpdate();
  };

  const handleMarkPaid = (id: string) => {
    updateBillStatus(id, 'paid');
    setBills(bills.map(b => b.id === id ? { ...b, status: 'paid' } : b));
    if (onUpdate) onUpdate();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id);
      setBills(bills.filter(b => b.id !== id));
      if (onUpdate) onUpdate();
    }
  };

  const { overdue, upcoming, paid } = getBillsByStatus(bills);
  const alertData = getUpcomingBillsAlert(bills);

  const getStatusBadge = (status: Bill['status']) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Paid</span>;
      case 'overdue':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Overdue</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Upcoming</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {(overdue.length > 0 || alertData.count > 0) && (
        <div className="space-y-3">
          {overdue.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800">Payment Overdue</h4>
                <p className="text-sm text-red-700 mt-1">
                  You have {overdue.length} overdue bill{overdue.length > 1 ? 's' : ''} totaling {formatCurrency(overdue.reduce((sum, b) => sum + b.amount, 0))}.
                </p>
              </div>
            </div>
          )}
          
          {alertData.count > 0 && overdue.length === 0 && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Bell className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800">Upcoming Bills</h4>
                <p className="text-sm text-amber-700 mt-1">
                  {alertData.count} bill{alertData.count > 1 ? 's are' : ' is'} due in the next 7 days ({formatCurrency(alertData.total)}).
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Bill Form */}
      {showForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Add New Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bill-name">Bill Name</Label>
                <Input
                  id="bill-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Rent, Electricity"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bill-amount">Amount</Label>
                  <Input
                    id="bill-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bill-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                    <SelectTrigger id="bill-category">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bill-date">Due Date</Label>
                <Input
                  id="bill-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bill
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bills List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Your Bills
            </CardTitle>
            {!showForm && (
              <Button size="sm" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm">No bills tracked yet</p>
              <p className="text-xs mt-1">Add your recurring bills to stay on top of payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overdue Section */}
              {overdue.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2">Overdue ({overdue.length})</h4>
                  <div className="space-y-2">
                    {overdue.map(bill => (
                      <BillItem key={bill.id} bill={bill} onMarkPaid={handleMarkPaid} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Section */}
              {upcoming.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-blue-600 mb-2">Upcoming ({upcoming.length})</h4>
                  <div className="space-y-2">
                    {upcoming.map(bill => (
                      <BillItem key={bill.id} bill={bill} onMarkPaid={handleMarkPaid} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              )}

              {/* Paid Section */}
              {paid.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-emerald-600 mb-2">Paid ({paid.length})</h4>
                  <div className="space-y-2">
                    {paid.map(bill => (
                      <BillItem key={bill.id} bill={bill} onMarkPaid={handleMarkPaid} onDelete={handleDelete} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BillItem({ bill, onMarkPaid, onDelete }: { bill: Bill; onMarkPaid: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{bill.name}</span>
          {getStatusBadge(bill.status)}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
          <span>{formatCurrency(bill.amount)}</span>
          <span>•</span>
          <span>{formatDate(bill.dueDate)}</span>
          <span>•</span>
          <span>{bill.category}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {bill.status !== 'paid' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onMarkPaid(bill.id)}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(bill.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function getStatusBadge(status: Bill['status']) {
  switch (status) {
    case 'paid':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">Paid</span>;
    case 'overdue':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700">Overdue</span>;
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">Upcoming</span>;
  }
}