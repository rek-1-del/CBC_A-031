import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarToolbar } from "@/components/ui/calendar-toolbar";
import { useCalendar } from "@/contexts/CalendarContext";
import { useQuery } from "@tanstack/react-query";
import { generateCalendarDays, getDaysInMonth, getMonthDates } from "@/lib/calendar";
import { formatDate, isSameDay } from "@/lib/utils/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CalendarView() {
  const { 
    selectedDate, 
    setSelectedDate, 
    viewMode, 
    setViewMode,
    currentMonth,
    setCurrentMonth,
    currentYear,
    setCurrentYear
  } = useCalendar();
  
  const [calendarDays, setCalendarDays] = useState<Array<Date | null>>([]);
  
  // Fetch events from API
  const { data: events = [] } = useQuery({
    queryKey: ['/api/events'],
  });
  
  useEffect(() => {
    const days = generateCalendarDays(currentYear, currentMonth);
    setCalendarDays(days);
  }, [currentMonth, currentYear]);
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const hasEventsOnDate = (date: Date | null) => {
    if (!date) return false;
    return events.some((event: any) => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date);
    });
  };
  
  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter((event: any) => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {formatDate(new Date(currentYear, currentMonth, 1), 'MMMM yyyy')}
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <CalendarToolbar
            viewMode={viewMode}
            onChange={setViewMode}
          />
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day && day.getMonth() === currentMonth;
            const isToday = day && isSameDay(day, new Date());
            const isSelected = day && isSameDay(day, selectedDate);
            const eventsOnDate = getEventsForDate(day);
            
            return (
              <div
                key={index}
                className={cn(
                  "calendar-day relative h-20 p-1 border border-neutral-200 rounded-md",
                  !isCurrentMonth && "bg-neutral-50 text-neutral-400",
                  isToday && "today border-2 border-primary",
                  isSelected && "bg-primary bg-opacity-10"
                )}
                onClick={() => handleDateClick(day)}
              >
                <span className="text-sm">{day ? day.getDate() : ''}</span>
                {eventsOnDate.length > 0 && (
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {eventsOnDate.slice(0, 2).map((event: any, i: number) => (
                      <div 
                        key={i}
                        className={`text-xs bg-${event.eventType === 'meeting' ? 'primary' : 
                                               event.eventType === 'consultation' ? 'error' : 
                                               event.eventType === 'conference' ? 'secondary' : 
                                               event.eventType === 'webinar' ? 'accent' : 
                                               event.eventType === 'break' ? 'warning' : 'primary'} 
                                   bg-opacity-20 text-${event.eventType === 'meeting' ? 'primary' : 
                                                    event.eventType === 'consultation' ? 'error' : 
                                                    event.eventType === 'conference' ? 'secondary' : 
                                                    event.eventType === 'webinar' ? 'accent' : 
                                                    event.eventType === 'break' ? 'warning' : 'primary'} 
                                   rounded px-1 py-0.5 truncate`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {eventsOnDate.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{eventsOnDate.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
