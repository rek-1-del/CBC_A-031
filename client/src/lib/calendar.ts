import { getDaysInMonth, getFirstDayOfMonth } from "./utils/date";

// Generate calendar days for a month including padding days
export function generateCalendarDays(year: number, month: number): Array<Date | null> {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const firstWeekday = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  
  // Create array for all days in the month
  const calendarDays: Array<Date | null> = [];
  
  // Add previous month's days
  for (let i = 0; i < firstWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }
  
  // Calculate how many days we need to add from the next month to complete the grid
  // A calendar grid typically has 6 rows (42 days) to accommodate all possible month layouts
  const remainingDays = 42 - calendarDays.length;
  
  // Add next month's days
  for (let i = 0; i < remainingDays; i++) {
    calendarDays.push(null);
  }
  
  return calendarDays;
}

// Get an array of dates for a month
export function getMonthDates(year: number, month: number): Date[] {
  const daysInMonth = getDaysInMonth(year, month);
  const dates: Date[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }
  
  return dates;
}

// Get a range of dates between start and end dates
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// Get the week of a date
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const diff = date.getDate() - day;
  
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  
  const weekDates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);
    weekDates.push(currentDate);
  }
  
  return weekDates;
}

// Get time slots for a day (e.g. every 30 minutes from 8 AM to 6 PM)
export function getTimeSlots(startHour: number = 8, endHour: number = 18, minuteInterval: number = 30): string[] {
  const slots: string[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += minuteInterval) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedMinute = minute.toString().padStart(2, '0');
      
      slots.push(`${formattedHour}:${formattedMinute} ${period}`);
    }
  }
  
  return slots;
}
