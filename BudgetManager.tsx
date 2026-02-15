import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { DEFAULT_CATEGORIES } from '../utils/categories';
import { loadBudgets, saveBudgets } from '../utils/storage';
import { Settings, Save } from 'lucide-react';

export function BudgetManager() {
  const [budgets, setBudgets] = useState(() => loadBudgets());
  const [isEditing, setIsEditing] = useState(false);

  const handleBudgetChange = (category: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setBudgets(prev => ({ ...prev, [category]: amount }));
  };

  const handleSave = () => {
    saveBudgets(budgets);
    setIsEditing(false);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Budget Settings
          </CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
              Edit Budgets
            </Button>
          ) : (
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {DEFAULT_CATEGORIES.map((category) => (
            <div key={category.name} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                <category.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <Label htmlFor={`budget-${category.name}`} className="text-sm text-slate-700">
                  {category.name}
                </Label>
              </div>
              <div className="w-32">
                {isEditing ? (
                  <Input
                    id={`budget-${category.name}`}
                    type="number"
                    value={budgets[category.name] || category.budget || ''}
                    onChange={(e) => handleBudgetChange(category.name, e.target.value)}
                    className="text-right"
                    placeholder="0"
                  />
                ) : (
                  <p className="text-right font-semibold text-slate-900">
                    ${((budgets[category.name] || category.budget) || 0).toFixed(0)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}