import { Transaction } from '../types';
import { categorizeTransaction } from './aiCategorizer';

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  isAiCategorized: boolean;
}

export function parseCSV(csvText: string): ParsedTransaction[] {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
  
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows.');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const data: ParsedTransaction[] = [];

  // Helper to find column index
  const findCol = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));

  const dateIdx = findCol(['date', 'time']);
  const descIdx = findCol(['description', 'desc', 'payee', 'merchant', 'name', 'transaction']);
  const amountIdx = findCol(['amount', 'value', 'debit', 'credit']);
  const typeIdx = findCol(['type', 'transaction type', 'debit/credit']);
  const catIdx = findCol(['category', 'cat', 'class']);

  // Fallback to default indices if headers not found
  const dIdx = dateIdx !== -1 ? dateIdx : 0;
  const dsIdx = descIdx !== -1 ? descIdx : 1;
  const aIdx = amountIdx !== -1 ? amountIdx : 2;
  const tIdx = typeIdx !== -1 ? typeIdx : 3;
  const cIdx = catIdx !== -1 ? catIdx : 4;

  for (let i = 1; i < lines.length; i++) {
    // Handle commas inside quotes (simple regex approach)
    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
    
    if (values.length < 3) continue; // Skip malformed rows

    const rawDate = values[dIdx];
    const rawAmount = values[aIdx];
    const rawType = values[tIdx];
    const rawCategory = values[cIdx] || '';
    const description = values[dsIdx] || 'Unknown Transaction';

    // Parse Date
    let date = new Date().toISOString().split('T')[0];
    if (rawDate) {
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString().split('T')[0];
      }
    }

    // Parse Amount
    let amount = parseFloat(rawAmount.replace(/[^0-9.-]+/g, ''));
    if (isNaN(amount)) continue;

    // Determine Type
    let type: 'income' | 'expense' = 'expense';
    if (rawType) {
      const typeStr = rawType.toLowerCase();
      type = typeStr.includes('income') || typeStr.includes('credit') || typeStr.includes('deposit') ? 'income' : 'expense';
    } else {
      // Infer from amount sign
      type = amount >= 0 ? 'income' : 'expense';
      amount = Math.abs(amount);
    }

    // Determine Category (AI Logic)
    let category = 'Other';
    let isAiCategorized = false;

    if (rawCategory && rawCategory !== 'Other' && rawCategory !== '') {
      // Use existing category if valid
      category = rawCategory;
    } else {
      // Use AI Categorizer
      const result = categorizeTransaction(description, amount, type);
      category = result.category;
      isAiCategorized = true;
    }

    data.push({
      date,
      description,
      amount,
      type,
      category,
      isAiCategorized
    });
  }

  return data;
}