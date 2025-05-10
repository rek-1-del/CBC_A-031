import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCalendar } from "@/contexts/CalendarContext";
import { useNotes } from "@/contexts/NotesContext";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, Bold, Italic, Underline, List, ListOrdered, Link } from "lucide-react";
import { format } from "date-fns";

export default function Notepad() {
  const { selectedDate } = useCalendar();
  const { content, setContent } = useNotes();
  const { toast } = useToast();
  
  // Fetch note for the selected date
  const { data: note, isLoading } = useQuery({
    queryKey: ['/api/notes', selectedDate.toISOString().split('T')[0]],
  });
  
  // Update note content when selectedDate changes
  useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent('');
    }
  }, [note, setContent]);
  
  // Save note mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const noteData = {
        userId: 1, // Mock user ID
        date: formattedDate,
        content,
      };
      
      if (note) {
        return apiRequest('PATCH', `/api/notes/${note.id}`, noteData);
      } else {
        return apiRequest('POST', '/api/notes', noteData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save note: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete note mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (note) {
        return apiRequest('DELETE', `/api/notes/${note.id}`);
      }
      throw new Error("No note to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setContent('');
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete note: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Formatting functions
  const applyFormat = (format: string) => {
    document.execCommand(format, false);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Daily Notes</h2>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending || !note}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Simple text editor toolbar */}
        <div className="flex items-center space-x-1 border-b border-neutral-200 pb-2 mb-3">
          <Button variant="ghost" size="icon" onClick={() => applyFormat('bold')}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat('italic')}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat('underline')}>
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat('insertUnorderedList')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat('insertOrderedList')}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormat('createLink')}>
            <Link className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Notepad content */}
        <div 
          className="notepad"
          contentEditable="true"
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
        />
      </CardContent>
    </Card>
  );
}
