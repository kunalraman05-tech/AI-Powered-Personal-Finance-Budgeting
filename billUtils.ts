import { Bill } from '../types';

const BILLS_KEY = 'fintrack_bills';

export function loadBills(): Bill[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(BILLS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBill(bill: Omit<Bill, 'id'>): Bill {
  const bills = loadBills();
  const newBill = {
    ...bill,
    id: Date.now().toString(),
  };
  bills.push(newBill);
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  return newBill;
}

export function updateBillStatus(id: string, status: Bill['status']): void {
  const bills = loadBills().map(b => 
    b.id === id ? { ...b, status } : b
  );
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
}

export function deleteBill(id: string): void {
  const bills = loadBills().filter(b => b.id !== id);
  localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
}

export function calculateBillStatus(dueDate: string, currentStatus: Bill['status']): Bill['status'] {
  if (currentStatus === 'paid') return 'paid';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  if (due < today) return 'overdue';
  return 'upcoming';
}

export function getBillsByStatus(bills: Bill[]): {
  overdue: Bill[];
  upcoming: Bill[];
  paid: Bill[];
} {
  return {
    overdue: bills.filter(b => b.status === 'overdue'),
    upcoming: bills.filter(b => b.status === 'upcoming').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    paid: bills.filter(b => b.status === 'paid'),
  };
}

export function getUpcomingBillsAlert(bills: Bill[]): { count: number; total: number } {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcoming = bills.filter(b => {
    if (b.status === 'paid') return false;
    const due = new Date(b.dueDate);
    return due >= today && due <= nextWeek;
  });

  return {
    count: upcoming.length,
    total: upcoming.reduce((sum, b) => sum + b.amount, 0),
  };
}