import { Currency } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: '$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: '$' },
];

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const selectedCurrency = CURRENCIES.find(c => c.value === value);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Currency:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px] h-8 text-sm">
          <SelectValue>
            {selectedCurrency && (
              <span className="flex items-center gap-2">
                <span className="font-medium">{selectedCurrency.symbol}</span>
                <span>{selectedCurrency.value}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map(currency => (
            <SelectItem key={currency.value} value={currency.value}>
              <span className="flex items-center gap-2">
                <span className="font-medium">{currency.symbol}</span>
                <span>{currency.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}