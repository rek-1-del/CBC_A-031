import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Eye, Calendar, Video, Stethoscope, MapPin, Globe } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils/date";

export default function UpcomingEvents() {
  // Fetch upcoming events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/events/upcoming'],
  });
  
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'meeting':
      case 'conference':
        return (
          <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        );
      case 'webinar':
        return (
          <div className="w-10 h-10 rounded-full bg-warning bg-opacity-20 flex items-center justify-center mr-3">
            <Video className="h-5 w-5 text-warning" />
          </div>
        );
      case 'surgery':
      case 'consultation':
        return (
          <div className="w-10 h-10 rounded-full bg-error bg-opacity-20 flex items-center justify-center mr-3">
            <Stethoscope className="h-5 w-5 text-error" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start p-2 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3"></div>
                <div className="flex-1">
                  <div className="h-5 bg-neutral-200 rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event: any, index: number) => (
              <div key={index} className="flex items-start p-2 hover:bg-neutral-50 rounded-md transition duration-150">
                {getEventIcon(event.eventType)}
                <div className="flex-1">
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-neutral-500">
                    {formatDate(new Date(event.startTime), 'MMM d')}, {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                  </p>
                  {event.location && (
                    <div className="flex items-center mt-1 text-xs text-neutral-500">
                      {event.location.toLowerCase().includes('online') ? (
                        <span><Globe className="inline h-3 w-3 mr-1" /> {event.location}</span>
                      ) : (
                        <span><MapPin className="inline h-3 w-3 mr-1" /> {event.location}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-sm text-neutral-500">No upcoming events</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 text-primary border-primary border-dashed"
        >
          <Eye className="h-4 w-4 mr-1" /> View All Events
        </Button>
      </CardContent>
    </Card>
  );
}
