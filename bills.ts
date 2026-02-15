import { Bill } from '../types';
import { formatCurrency } from './calculations';

export interface BillStatus {
  total: number;
  paid: number;
  unpaid: number;
  overdue: number;
  upcoming: number;
}

export interface CategorizedBill extends Bill {
  status: 'paid' | 'unpaid' | 'overdue' | 'upcoming';
  daysUntilDue?: number;
}

export const calculateBillStatus = (bills: Bill[]): BillStatus & { categorized: CategorizedBill[] } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const categorized = bills.map(bill => {
    const dueDate = new Date(bill.dueDate);
    const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const daysUntilDue = Math.floor((dueDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'paid' | 'unpaid' | 'overdue' | 'upcoming';
    
    if (bill.paid) {
      status = 'paid';
    } else if (daysUntilDue < 0) {
      status = 'overdue';
    } else if (daysUntilDue <= 7) {
      status = 'unpaid';
    } else {
      status = 'upcoming';
    }
    
    return { ...bill, status, daysUntilDue };
  });
  
  const total = bills.reduce((sum, b) => sum + b.amount, 0);
  const paid = bills.filter(b => b.paid).reduce((sum, b) => sum + b.amount, 0);
  const unpaid = bills.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0);
  const overdue = categorized.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0);
  const upcoming = categorized.filter(b => b.status === 'upcoming').reduce((sum, b) => sum + b.amount, 0);
  
  return {
    total,
    paid,
    unpaid,
    overdue,
    upcoming,
    categorized: categorized.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    }),
  };
};