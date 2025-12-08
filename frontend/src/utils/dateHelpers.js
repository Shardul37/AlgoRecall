import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isToday } from 'date-fns';

export const getCalendarDays = (currentDate) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday Start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({
        start: startDate,
        end: endDate
    });
};

// Check if a list of revisions has any overdue items
export const hasOverdue = (revisions = []) => {
    return revisions.some(r => r.is_overdue && !r.is_completed);
};