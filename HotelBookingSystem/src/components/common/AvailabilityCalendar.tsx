import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AvailabilityCalendarProps {
  roomId: string | number;
  bookedDates?: Date[]; // Dates that are already booked
}

export function AvailabilityCalendar({ roomId, bookedDates = [] }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  // Mock booked dates if none provided (for demo)
  const demoBookedDates = bookedDates.length > 0 ? bookedDates : [
    addDays(today, 2),
    addDays(today, 3),
    addDays(today, 7),
    addDays(today, 8),
    addDays(today, 9),
    addDays(today, 15),
  ];

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-gray-500" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isBooked = demoBookedDates.some(d => isSameDay(d, cloneDay));
        const isPast = isBefore(cloneDay, today);
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`relative h-12 flex items-center justify-center text-sm transition-all
              ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300'}
              ${isBooked ? 'bg-red-50 dark:bg-red-900/20 text-red-500 line-through' : ''}
              ${isPast && isCurrentMonth ? 'opacity-40' : ''}
              ${isSameDay(day, today) ? 'font-bold underline decoration-[#C6A87C] decoration-2 underline-offset-4' : ''}
            `}
          >
            <span>{formattedDate}</span>
            {isBooked && (
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            )}
            {!isBooked && !isPast && isCurrentMonth && (
              <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">{rows}</div>;
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b dark:border-gray-800">
        <CalendarIcon className="text-[#C6A87C]" size={20} />
        <h2 className="text-xl font-bold dark:text-white">Disponibilités</h2>
      </div>
      
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      <div className="mt-6 flex items-center justify-center gap-6 text-xs font-medium border-t dark:border-gray-800 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 rounded-sm"></div>
          <span className="text-gray-500 dark:text-gray-400">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-sm"></div>
          <span className="text-gray-500 dark:text-gray-400">Occupé</span>
        </div>
      </div>
    </div>
  );
}
