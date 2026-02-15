import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ImportModal({ isOpen, onClose, children }: ImportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Import Transactions</h2>
            <p className="text-xs text-slate-500">Supports CSV, Excel (.xlsx), and PDF</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}