import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { addMonths, subMonths, format, isSameMonth, isToday, parseISO } from 'date-fns';
import clsx from 'clsx';
import useStore from '../../store/useStore';
import { getCalendarDays, hasOverdue } from '../../utils/dateHelpers';
import ProblemModal from '../shared/ProblemModal';

const CalendarView = () => {
  const { calendarData, fetchCalendar } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  // New State for Modal
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  // Fetch data when month changes
  useEffect(() => {
    const month = currentDate.getMonth() + 1; // JS months are 0-indexed
    const year = currentDate.getFullYear();
    fetchCalendar(month, year);
  }, [currentDate]);

  const days = getCalendarDays(currentDate);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
            {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-surface rounded-lg transition-colors">
                <ChevronLeft size={20} />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-surface rounded-lg transition-colors">
                <ChevronRight size={20} />
            </button>
        </div>
      </div>

      {/* Grid Header (Mon-Sun) */}
      <div className="grid grid-cols-7 gap-4 text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-dim text-sm font-medium uppercase tracking-wider">
                {day}
            </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4 auto-rows-[120px]">
        {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayRevisions = calendarData[dateKey] || [];
            
            // Visual Logic
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);
            const isOverdueDay = hasOverdue(dayRevisions);
            
            // Calculate Gradient / Status Color
            let bgClass = "bg-surface/50"; // Default
            if (dayRevisions.length > 0) {
                const allDone = dayRevisions.every(r => r.is_completed);
                if (allDone) bgClass = "bg-success/10 border-success/20"; // Green tint
                else if (isOverdueDay) bgClass = "bg-danger/10 border-danger/30"; // Red tint
                else bgClass = "bg-primary/10 border-primary/20"; // Blue tint (Pending)
            }

            return (
                <div 
                    key={day.toString()} 
                    className={clsx(
                        "rounded-xl border p-3 flex flex-col transition-all hover:scale-[1.02]",
                        isCurrentMonth ? "opacity-100" : "opacity-30 grayscale",
                        isDayToday ? "ring-2 ring-primary border-primary" : "border-dim/20",
                        bgClass
                    )}
                >
                    {/* Date Number */}
                    <div className="flex justify-between items-start mb-2">
                        <span className={clsx(
                            "text-sm font-medium",
                            isDayToday ? "text-primary" : "text-dim"
                        )}>
                            {format(day, 'd')}
                        </span>
                        
                        {/* Status Icon */}
                        {dayRevisions.length > 0 && dayRevisions.every(r => r.is_completed) && (
                            <CheckCircle size={14} className="text-success" />
                        )}
                        {isOverdueDay && (
                            <AlertCircle size={14} className="text-danger animate-pulse" />
                        )}
                    </div>

                    {/* Task Dots / List */}
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar max-h-full">
                        {dayRevisions.map((rev, idx) => (
                            <button
                                key={idx}
                                title={rev.problem_name}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent bubbling
                                    setSelectedProblemId(rev.problem_id); // <--- OPEN MODAL
                                }}
                                className="w-full text-left truncate text-[10px] px-1.5 py-0.5 rounded bg-background/60 text-dim hover:bg-background hover:text-white hover:shadow-sm transition-all"
                            >
                                {rev.problem_name}
                            </button>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>

      {/* RENDER MODAL IF OPEN */}
      {selectedProblemId && (
        <ProblemModal
            problemId={selectedProblemId}
            onClose={() => setSelectedProblemId(null)}
        />
      )}

    </div>
  );
};

export default CalendarView;