import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useCalendar } from "@/contexts/CalendarContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingEvent?: any;
}

const eventFormSchema = insertEventSchema.extend({
  date: z.date(),
  startHour: z.string(),
  endHour: z.string(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventModal({ 
  isOpen, 
  onClose, 
  existingEvent 
}: EventModalProps) {
  const { selectedDate } = useCalendar();
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: existingEvent ? {
      userId: 1, // Mock user ID
      title: existingEvent.title,
      description: existingEvent.description,
      date: new Date(existingEvent.startTime),
      startHour: format(new Date(existingEvent.startTime), 'HH:mm'),
      endHour: format(new Date(existingEvent.endTime), 'HH:mm'),
      location: existingEvent.location,
      eventType: existingEvent.eventType,
      participants: existingEvent.participants,
      hasReminder: existingEvent.hasReminder,
    } : {
      userId: 1, // Mock user ID
      title: '',
      description: '',
      date: selectedDate,
      startHour: '09:00',
      endHour: '10:00',
      location: '',
      eventType: 'meeting',
      participants: '',
      hasReminder: false,
    }
  });
  
  // Create or update event mutation
  const mutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      // Convert form values to event object
      const startDate = new Date(values.date);
      const [startHours, startMinutes] = values.startHour.split(':').map(Number);
      startDate.setHours(startHours, startMinutes);
      
      const endDate = new Date(values.date);
      const [endHours, endMinutes] = values.endHour.split(':').map(Number);
      endDate.setHours(endHours, endMinutes);
      
      const eventData = {
        userId: values.userId,
        title: values.title,
        description: values.description,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        location: values.location,
        eventType: values.eventType,
        participants: values.participants,
        hasReminder: values.hasReminder
      };
      
      if (existingEvent) {
        return apiRequest('PATCH', `/api/events/${existingEvent.id}`, eventData);
      } else {
        return apiRequest('POST', '/api/events', eventData);
      }
    },
    onSuccess: () => {
      // Invalidate events query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      
      toast({
        title: existingEvent ? "Event updated" : "Event created",
        description: existingEvent 
          ? "Your event has been updated successfully." 
          : "Your event has been created successfully.",
      });
      
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${existingEvent ? 'update' : 'create'} event: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (values: EventFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{existingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="consultation">Patient Consultation</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="break">Break</SelectItem>
                        <SelectItem value="rounds">Patient Rounds</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter event details" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants</FormLabel>
                  <FormControl>
                    <Input placeholder="Add participants" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Separate email addresses with commas
                  </p>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hasReminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Set reminder notification
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6 sm:justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {existingEvent ? 'Update' : 'Create'} Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
