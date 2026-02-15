import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Download, FileSpreadsheet, Printer, Calendar, FileText } from 'lucide-react';
import { Transaction, Currency } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';

interface ReportsTabProps {
  transactions: Transaction[];
  currency: Currency;
}

type Timeframe = 'month' | 'year' | 'ytd';
type Format = 'excel' | 'pdf';

export function ReportsTab({ transactions, currency }: ReportsTabProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [format, setFormat] = useState<Format>('excel');
  
  // Date selection state
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-11
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Filter transactions based on selection
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const tYear = tDate.getFullYear();
      const tMonth = tDate.getMonth();

      if (timeframe === 'year') {
        return tYear === selectedYear;
      }
      
      if (timeframe === 'ytd') {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return tDate >= startOfYear && tDate <= now;
      }

      // Default: month
      return tYear === selectedYear && tMonth === selectedMonth;
    });
  }, [transactions, timeframe, selectedYear, selectedMonth]);

  // Calculate Summary for the report
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [filteredTransactions]);

  // Generate CSV for Excel
  const handleExportExcel = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.amount.toFixed(2),
      'Completed'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `FinTrack_Report_${timeframe}_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate Print View for PDF
  const handleExportPDF = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const title = timeframe === 'ytd' 
      ? `Year to Date Report - ${new Date().getFullYear()}`
      : timeframe === 'year'
      ? `Annual Report - ${selectedYear}`
      : `Monthly Report - ${new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} ${selectedYear}`;

    const tableRows = filteredTransactions.map(t => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px;">${t.date}</td>
        <td style="padding: 8px; text-transform: capitalize;">${t.type}</td>
        <td style="padding: 8px;">${t.category}</td>
        <td style="padding: 8px; text-align: right; font-weight: bold; color: ${t.type === 'income' ? 'green' : 'red'};">
          ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount, currency)}
        </td>
      </tr>
    `).join('');

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #334155; }
            h1 { color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            .summary { display: flex; gap: 20px; margin: 20px 0; background: #f8fafc; padding: 15px; border-radius: 8px; }
            .summary-item { flex: 1; }
            .summary-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
            .summary-value { font-size: 24px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 10px; background: #f1f5f9; color: #475569; }
            td { padding: 8px; }
            .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <h1>FinTrack Financial Report</h1>
          <p><strong>Period:</strong> ${title}</p>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Total Income</div>
              <div class="summary-value" style="color: green;">${formatCurrency(summary.income, currency)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Expenses</div>
              <div class="summary-value" style="color: red;">${formatCurrency(summary.expenses, currency)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Net Balance</div>
              <div class="summary-value" style="color: ${summary.balance >= 0 ? '#1e293b' : 'red'};">
                ${formatCurrency(summary.balance, currency)}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            Generated by FinTrack on ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleGenerate = () => {
    if (format === 'excel') {
      handleExportExcel();
    } else {
      handleExportPDF();
    }
  };

  // Generate Year Options (Current year - 5 to Current year + 1)
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Generate Report
          </CardTitle>
          <CardDescription>
            Export your financial data for analysis or record keeping.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timeframe Selection */}
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={(v: Timeframe) => setTimeframe(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="ytd">Year to Date (YTD)</SelectItem>
                  <SelectItem value="year">Full Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Year Selection */}
            <div className="space-y-2">
              <Label>Year</Label>
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(v) => setSelectedYear(parseInt(v))}
                disabled={timeframe === 'ytd'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Month Selection (Only for Month timeframe) */}
            {timeframe === 'month' && (
              <div className="space-y-2">
                <Label>Month</Label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(v) => setSelectedMonth(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((name, index) => (
                      <SelectItem key={index} value={index.toString()}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Format Selection & Action */}
          <div className="flex flex-col sm:flex-row gap-4 items-end pt-4 border-t border-slate-100">
            <div className="flex-1 space-y-2 w-full">
              <Label>Export Format</Label>
              <Select value={format} onValueChange={(v: Format) => setFormat(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      Excel (CSV)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <Printer className="h-4 w-4 text-red-600" />
                      PDF (Print View)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              disabled={filteredTransactions.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Preview</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transactions found for selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-600 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(summary.income, currency)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <p className="text-sm text-red-600 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(summary.expenses, currency)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 font-medium">Net Balance</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
                {formatCurrency(summary.balance, currency)}
              </p>
            </div>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.slice(0, 10).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-600">{formatDate(t.date)}</td>
                      <td className="px-4 py-3 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800">{t.category}</td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length > 10 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-slate-500 italic">
                        ... and {filteredTransactions.length - 10} more transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No transactions found for this period.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}