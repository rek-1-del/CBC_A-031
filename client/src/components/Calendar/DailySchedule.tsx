import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MapPin, Users, FileText } from "lucide-react";
import { useCalendar } from "@/contexts/CalendarContext";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

export default function DailySchedule() {
  const { selectedDate, setIsModalOpen } = useCalendar();
  
  // Fetch events for selected date
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/events', selectedDate.toISOString().split('T')[0]],
  });
  
  // Generate time slots from 8 AM to 6 PM
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8; // Starting from 8 AM
    return {
      time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
      hour,
    };
  });
  
  const getEventsForTimeSlot = (hour: number) => {
    return events.filter((event: any) => {
      const startHour = new Date(event.startTime).getHours();
      return startHour === hour;
    });
  };
  
  const getEventTypeStyles = (eventType: string) => {
    switch (eventType) {
      case 'meeting':
        return 'bg-primary bg-opacity-10 border-l-4 border-primary';
      case 'consultation':
        return 'bg-error bg-opacity-10 border-l-4 border-error';
      case 'surgery':
        return 'bg-error bg-opacity-10 border-l-4 border-error';
      case 'conference':
        return 'bg-secondary bg-opacity-10 border-l-4 border-secondary';
      case 'webinar':
        return 'bg-accent bg-opacity-10 border-l-4 border-accent';
      case 'break':
        return 'bg-warning bg-opacity-10 border-l-4 border-warning';
      case 'rounds':
        return 'bg-secondary bg-opacity-10 border-l-4 border-secondary';
      case 'research':
        return 'bg-primary bg-opacity-10 border-l-4 border-primary';
      default:
        return 'bg-primary bg-opacity-10 border-l-4 border-primary';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {formatDate(selectedDate, 'MMMM d, yyyy')} - Schedule
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary" 
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </div>
        
        {/* Time slots */}
        <ScrollArea className="h-80 pr-2">
          <div className="space-y-2">
            {timeSlots.map((slot) => {
              const slotEvents = getEventsForTimeSlot(slot.hour);
              
              return (
                <div 
                  key={slot.hour} 
                  className="time-slot flex p-2 hover:bg-neutral-50 rounded-md transition duration-150"
                >
                  <div className="w-16 text-sm font-medium text-neutral-500">
                    {slot.time}
                  </div>
                  <div className="flex-1 ml-2 pl-2 border-l border-neutral-200">
                    {slotEvents.length > 0 ? (
                      <div className="space-y-2">
                        {slotEvents.map((event: any, index: number) => (
                          <div 
                            key={index}
                            className={cn(
                              "rounded-md p-2",
                              getEventTypeStyles(event.eventType)
                            )}
                          >
                            <div className="flex justify-between">
                              <h3 className="font-medium">{event.title}</h3>
                              <span className="text-sm text-neutral-500">
                                {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">{event.description}</p>
                            <div className="flex items-center mt-1 text-xs text-neutral-500">
                              {event.location && (
                                <span className="mr-2">
                                  <MapPin className="inline h-3 w-3 mr-1" /> {event.location}
                                </span>
                              )}
                              {event.participants && (
                                <span>
                                  <Users className="inline h-3 w-3 mr-1" /> 
                                  {event.participants.split(',').length} Participants
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-neutral-300 rounded-md p-2 bg-neutral-50">
                        <p className="text-sm text-neutral-500 italic">Available</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
