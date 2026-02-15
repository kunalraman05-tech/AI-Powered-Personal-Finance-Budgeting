import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Sparkles, Plus, ArrowRightLeft, ArrowDownFromLine, Check, X } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';
import { Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense' | 'transfer' | 'withdrawal'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [aiInput, setAiInput] = useState('');
  
  // Confirmation Modal State
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [parsedTransaction, setParsedTransaction] = useState<Omit<Transaction, 'id'> | null>(null);

  // Filter categories based on selected type
  const availableCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    onSubmit({
      type,
      category,
      amount: parseFloat(amount),
      date,
    });

    // Reset form
    setCategory('');
    setAmount('');
    setAiInput('');
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleAIParse = () => {
    const text = aiInput.toLowerCase();
    
    // 1. Detect Type
    let detectedType: 'income' | 'expense' | 'transfer' | 'withdrawal' = 'expense';
    if (text.includes('income') || text.includes('earned') || text.includes('salary') || text.includes('deposit')) {
      detectedType = 'income';
    } else if (text.includes('transfer') || text.includes('move') || text.includes('savings')) {
      detectedType = 'transfer';
    } else if (text.includes('withdrawal') || text.includes('cash out') || text.includes('atm')) {
      detectedType = 'withdrawal';
    }

    // 2. Detect Amount (find first number in string)
    const amountMatch = text.match(/(\d+(\.\d{1,2})?)/);
    const detectedAmount = amountMatch ? amountMatch[0] : '';

    // 3. Detect Category
    let detectedCategory = 'Other';
    const categoryKeywords: Record<string, string[]> = {
      'Salary': ['salary', 'paycheck', 'wage'],
      'Rent': ['rent', 'lease', 'housing'],
      'Groceries': ['groceries', 'food', 'supermarket', 'market'],
      'Transportation': ['transport', 'uber', 'lyft', 'gas', 'fuel', 'bus', 'train'],
      'Entertainment': ['movie', 'game', 'fun', 'netflix', 'spotify', 'concert'],
      'Utilities': ['electric', 'water', 'internet', 'phone', 'bill'],
      'Health': ['doctor', 'medicine', 'pharmacy', 'gym', 'health'],
      'Other': ['misc', 'stuff']
    };

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        detectedCategory = cat;
        break;
      }
    }

    // 4. Detect Date
    let detectedDate = new Date().toISOString().slice(0, 10);
    if (text.includes('yesterday')) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      detectedDate = d.toISOString().slice(0, 10);
    }

    // Create the transaction object
    const transaction: Omit<Transaction, 'id'> = {
      type: detectedType,
      category: detectedCategory,
      amount: parseFloat(detectedAmount) || 0,
      date: detectedDate,
    };

    // Set state for confirmation
    setParsedTransaction(transaction);
    setShowConfirmDialog(true);
  };

  const handleConfirmAdd = () => {
    if (parsedTransaction) {
      onSubmit(parsedTransaction);
      // Reset everything
      setParsedTransaction(null);
      setShowConfirmDialog(false);
      setAiInput('');
      setCategory('');
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  };

  const handleEditManually = () => {
    if (parsedTransaction) {
      // Populate form with parsed data for editing
      setType(parsedTransaction.type);
      setCategory(parsedTransaction.category);
      setAmount(parsedTransaction.amount.toString());
      setDate(parsedTransaction.date);
    }
    setShowConfirmDialog(false);
    setParsedTransaction(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Transaction
        </h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* AI Quick Add Section */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            AI Quick Add
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Spent $45 on groceries yesterday"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button 
              type="button" 
              onClick={handleAIParse}
              variant="secondary"
              className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Parse
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Try: "Paid $50 for rent", "Earned $3000 salary", "Lunch $15"
          </p>
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup value={type} onValueChange={(v) => {
              setType(v as 'income' | 'expense' | 'transfer' | 'withdrawal');
              setCategory(''); // Reset category when type changes
            }}>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="font-normal cursor-pointer">Expense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="font-normal cursor-pointer">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="font-normal cursor-pointer">Transfer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="withdrawal" id="withdrawal" />
                  <Label htmlFor="withdrawal" className="font-normal cursor-pointer">Withdrawal</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Add Transaction
          </Button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDialog && parsedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowConfirmDialog(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-white animate-pulse" />
                <h3 className="text-lg font-semibold text-white">Confirm Transaction</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                AI parsed your input. Is this correct?
              </p>
              
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Type</span>
                  <span className={`text-sm font-semibold capitalize ${
                    parsedTransaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {parsedTransaction.type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Category</span>
                  <span className="text-sm font-semibold text-slate-800">{parsedTransaction.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Amount</span>
                  <span className="text-lg font-bold text-slate-900">
                    ${parsedTransaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Date</span>
                  <span className="text-sm font-semibold text-slate-800">{parsedTransaction.date}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleConfirmAdd}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirm & Add
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEditManually}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Edit Manually
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}