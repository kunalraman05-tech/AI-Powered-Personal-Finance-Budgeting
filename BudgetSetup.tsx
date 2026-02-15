import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Budget, Currency } from '../types';
import { loadBudgets, saveBudgets } from '../utils/storage';
import { formatCurrency } from '../utils/calculations';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';

interface BudgetSetupProps {
  onBudgetUpdate: () => void;
  currency: Currency;
}

const DEFAULT_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Savings',
  'Other',
];

export function BudgetSetup({ onBudgetUpdate, currency }: BudgetSetupProps) {
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedBudgets = loadBudgets();
    const budgetMap: Record<string, number> = {};
    savedBudgets.forEach((b) => {
      budgetMap[b.category] = b.limit;
    });
    setBudgets(budgetMap);
  }, []);

  const handleBudgetChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBudgets((prev) => ({ ...prev, [category]: numValue }));
  };

  const handleSave = () => {
    const budgetList: Budget[] = Object.entries(budgets)
      .filter(([_, limit]) => limit > 0)
      .map(([category, limit]) => ({ category, limit }));
    
    saveBudgets(budgetList);
    onBudgetUpdate();
  };

  const toggleCategory = (category: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(category)) {
      newOpen.delete(category);
    } else {
      newOpen.add(category);
    }
    setOpenCategories(newOpen);
  };

  const toggleAll = () => {
    if (openCategories.size === DEFAULT_CATEGORIES.length) {
      setOpenCategories(new Set());
    } else {
      setOpenCategories(new Set(DEFAULT_CATEGORIES));
    }
  };

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Monthly Budget Setup</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleAll}>
          {openCategories.size === DEFAULT_CATEGORIES.length ? 'Collapse All' : 'Expand All'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-sm font-medium text-slate-700">Total Monthly Budget</span>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(totalBudget, currency)}</span>
        </div>

        <div className="space-y-2">
          {DEFAULT_CATEGORIES.map((category) => {
            const isOpen = openCategories.has(category);
            const currentBudget = budgets[category] || 0;

            return (
              <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm text-slate-700">{category}</span>
                    <div className="flex items-center gap-3">
                      {currentBudget > 0 && (
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrency(currentBudget, currency)}
                        </span>
                      )}
                      {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                  </div>
                </button>
                
                {isOpen && (
                  <div className="p-3 bg-slate-50 border-t border-slate-100 animate-in slide-down-from-top-2">
                    <div className="space-y-2">
                      <Label htmlFor={`budget-${category}`} className="text-xs text-slate-500">
                        Set monthly limit for {category}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`budget-${category}`}
                          type="number"
                          placeholder="0.00"
                          value={budgets[category] || ''}
                          onChange={(e) => handleBudgetChange(category, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Budgets
        </Button>
      </CardContent>
    </Card>
  );
}