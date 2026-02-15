import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Bill } from '../types';
import { addBill } from '../utils/storage';
import { getExpenseCategories } from '../utils/categories';
import { Plus } from 'lucide-react';

interface BillFormProps {
  onBillAdded: () => void;
}

export function BillForm({ onBillAdded }: BillFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPeriod, setRecurringPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !dueDate || !category) return;

    const bill: Bill = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      dueDate,
      category,
      status: 'pending',
      isRecurring,
      recurringPeriod: isRecurring ? recurringPeriod : undefined,
    };

    addBill(bill);
    onBillAdded();
    
    // Reset form
    setName('');
    setAmount('');
    setDueDate('');
    setCategory('');
    setIsRecurring(false);
  };

  const categories = getExpenseCategories();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Bill
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-name">Bill Name</Label>
            <Input
              id="bill-name"
              placeholder="e.g., Rent, Electricity"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Amount</Label>
              <Input
                id="bill-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bill-due-date">Due Date</Label>
              <Input
                id="bill-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bill-category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="bill-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring" className="cursor-pointer">Recurring Bill</Label>
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {isRecurring && (
              <div className="space-y-2 pl-4">
                <Label>Recurring Period</Label>
                <RadioGroup
                  value={recurringPeriod}
                  onValueChange={(value) => setRecurringPeriod(value as any)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer text-sm">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="cursor-pointer text-sm">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="cursor-pointer text-sm">Yearly</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Add Bill
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}