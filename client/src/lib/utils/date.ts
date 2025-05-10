import { format, isSameDay as fnsIsSameDay } from "date-fns";

// Format date using date-fns
export function formatDate(date: Date, formatString: string): string {
  return format(date, formatString);
}

// Format time in 12-hour format
export function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return fnsIsSameDay(date1, date2);
}

// Get the day of the week (0-6, where 0 is Sunday)
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

// Get days in a month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Add days to a date
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Subtract days from a date
export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

// Get the first day of the month
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

// Get the last day of the month
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

// Check if a date is today
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}
