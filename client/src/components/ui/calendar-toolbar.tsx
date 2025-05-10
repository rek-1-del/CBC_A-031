import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarToolbarProps {
  viewMode: string;
  onChange: (mode: string) => void;
}

export function CalendarToolbar({ viewMode, onChange }: CalendarToolbarProps) {
  const views = [
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ];

  return (
    <div className="flex items-center space-x-2">
      {views.map((view) => (
        <Button
          key={view.id}
          variant="ghost"
          size="sm"
          className={cn(
            "px-3 py-1.5 text-sm rounded-md",
            viewMode === view.id
              ? "bg-primary bg-opacity-10 text-primary"
              : "text-primary hover:bg-primary hover:bg-opacity-10"
          )}
          onClick={() => onChange(view.id)}
        >
          {view.label}
        </Button>
      ))}
    </div>
  );
}
