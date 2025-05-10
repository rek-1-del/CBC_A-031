import { createContext, useContext, useState, ReactNode } from "react";

interface CalendarContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  currentMonth: number;
  setCurrentMonth: (month: number) => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const today = new Date();
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewMode, setViewMode] = useState<string>("month");
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        viewMode,
        setViewMode,
        currentMonth,
        setCurrentMonth,
        currentYear,
        setCurrentYear,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextType {
  const context = useContext(CalendarContext);
  
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  
  return context;
}
