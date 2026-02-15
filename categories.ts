export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other'] as const;

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Groceries',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Health',
  'Shopping',
  'Dining',
  'Other',
] as const;

// Combined list for general use
export const CATEGORIES = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  'Salary': 'bg-emerald-500',
  'Freelance': 'bg-teal-500',
  'Investments': 'bg-green-500',
  'Rent': 'bg-blue-500',
  'Groceries': 'bg-lime-500',
  'Transportation': 'bg-amber-500',
  'Entertainment': 'bg-purple-500',
  'Utilities': 'bg-cyan-500',
  'Health': 'bg-red-500',
  'Shopping': 'bg-pink-500',
  'Dining': 'bg-orange-500',
  'Other': 'bg-slate-500',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'bg-slate-500';
}

export function getExpenseCategories(): readonly string[] {
  return EXPENSE_CATEGORIES;
}