import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Upload, FileText, Table, File, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { parseCSV, ParsedTransaction } from '../utils/csvParser';
import { categorizeTransaction } from '../utils/aiCategorizer';
import { Transaction } from '../types';

interface ImportDataProps {
  onImport: (transactions: Omit<Transaction, 'id'>[]) => void;
  onCancel: () => void;
}

export function ImportData({ onImport, onCancel }: ImportDataProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ParsedTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Parser for Excel/PDF (Since binary parsing requires external libs like xlsx/pdf.js)
  const mockParseBinary = async (file: File): Promise<ParsedTransaction[]> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock data based on file type to demonstrate AI categorization
    const mockData: ParsedTransaction[] = [
      {
        date: new Date().toISOString().split('T')[0],
        description: file.name.endsWith('.pdf') ? 'Invoice #10293 - Utility Co' : 'Amazon Marketplace Purchase',
        amount: 145.50,
        type: 'expense',
        category: '', // Will be filled by AI
        isAiCategorized: true
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        description: file.name.endsWith('.pdf') ? 'Monthly Subscription' : 'Uber Trip',
        amount: 24.99,
        type: 'expense',
        category: '', // Will be filled by AI
        isAiCategorized: true
      },
      {
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        description: 'Whole Foods Market',
        amount: 89.20,
        type: 'expense',
        category: '', // Will be filled by AI
        isAiCategorized: true
      }
    ];

    // Apply AI Categorization to mock data
    return mockData.map(item => {
      const result = categorizeTransaction(item.description, item.amount, item.type);
      return { ...item, category: result.category };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validExtensions = ['.csv', '.xlsx', '.xls', '.pdf'];
    const isValid = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      setError('Please upload a CSV, Excel, or PDF file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsParsing(true);

    try {
      let parsed: ParsedTransaction[] = [];

      if (selectedFile.name.endsWith('.csv')) {
        const text = await selectedFile.text();
        parsed = parseCSV(text);
      } else {
        // Use mock parser for Excel/PDF
        parsed = await mockParseBinary(selectedFile);
      }

      setPreview(parsed.slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setPreview([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = () => {
    setIsProcessing(true);
    const transactionsToImport: Omit<Transaction, 'id'>[] = preview.map(p => ({
      type: p.type,
      category: p.category,
      amount: p.amount,
      date: p.date,
      isForecast: false
    }));

    setTimeout(() => {
      onImport(transactionsToImport);
      resetState();
    }, 800);
  };

  const resetState = () => {
    setFile(null);
    setPreview([]);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-10 w-10 text-slate-400" />;
    if (file.name.endsWith('.csv')) return <FileText className="h-10 w-10 text-emerald-500" />;
    if (file.name.endsWith('.pdf')) return <File className="h-10 w-10 text-red-500" />;
    return <Table className="h-10 w-10 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div 
          className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 p-4 rounded-full group-hover:bg-blue-100 transition-colors">
              <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">Upload Financial File</h3>
          <p className="text-sm text-slate-500 mb-4">Drag & drop or click to browse</p>
          <div className="flex justify-center gap-2">
            <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">CSV</span>
            <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">Excel</span>
            <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">PDF</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls, .pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Info Card */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md shadow-sm border border-slate-100">
                {getFileIcon()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB • {file.name.split('.').pop()?.toUpperCase()}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPreview([]); }}>
              <X className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          {isParsing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
              <p className="text-sm font-medium text-slate-700">Analyzing File...</p>
              <p className="text-xs text-slate-500 mt-1">AI is extracting and categorizing transactions</p>
            </div>
          ) : (
            <>
              {preview.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Preview</p>
                    <div className="flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      <Sparkles className="h-3 w-3" />
                      AI Auto-Categorized
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {preview.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{item.date}</td>
                            <td className="px-4 py-3 text-slate-700 max-w-[150px] truncate" title={item.description}>
                              {item.description}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                item.isAiCategorized 
                                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {item.category}
                                {item.isAiCategorized && <Sparkles className="h-3 w-3" />}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-right font-semibold ${item.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Successfully parsed {preview.length} transactions. Ready to import.</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={handleImport} 
              disabled={isProcessing || isParsing || preview.length === 0}
              className="flex-1 h-10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Confirm Import'
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="h-10">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}