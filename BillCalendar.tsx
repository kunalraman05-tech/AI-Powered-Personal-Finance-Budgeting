import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Bill } from '../types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface BillCalendarProps {
  bills: Bill[];
}

export function BillCalendar({ bills }: BillCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Short format: "Jan 2024"
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const getBillsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bills.filter(b => b.dueDate === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Compact Title */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-800">Bills</span>
          </div>

          {/* Compact Navigation Controls */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 hover:bg-slate-100" 
              onClick={prevMonth}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-semibold min-w-[75px] text-center text-slate-700 select-none">
              {monthName}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 hover:bg-slate-100" 
              onClick={nextMonth}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-3 bg-slate-300 mx-1" />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs font-medium hover:bg-slate-100" 
              onClick={goToToday}
            >
              Today
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-[10px] font-medium text-slate-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dayBills = getBillsForDay(day);
            const isToday = day === new Date().getDate() && 
                           currentDate.getMonth() === new Date().getMonth() && 
                           currentDate.getFullYear() === new Date().getFullYear();
            
            return (
              <div
                key={day}
                className={`aspect-square border border-slate-100 rounded-md p-0.5 hover:bg-slate-50 transition-colors relative ${
                  isToday ? 'bg-indigo-50 border-indigo-200' : ''
                }`}
              >
                <span className={`text-[10px] font-medium block text-center ${isToday ? 'text-indigo-600' : 'text-slate-600'}`}>
                  {day}
                </span>
                {dayBills.length > 0 && (
                  <div className="mt-0.5 space-y-0.5">
                    {dayBills.slice(0, 2).map(bill => (
                      <div
                        key={bill.id}
                        className={`text-[9px] px-0.5 py-0.5 rounded truncate leading-tight ${
                          bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          bill.status === 'overdue' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                        title={bill.name}
                      >
                        {bill.name}
                      </div>
                    ))}
                    {dayBills.length > 2 && (
                      <div className="text-[9px] text-slate-500 text-center leading-tight">
                        +{dayBills.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-200" />
            <span className="text-[10px] text-slate-600">Paid</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200" />
            <span className="text-[10px] text-slate-600">Upcoming</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-100 border border-red-200" />
            <span className="text-[10px] text-slate-600">Overdue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}