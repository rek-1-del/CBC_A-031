import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import CalendarView from "@/components/Calendar/CalendarView";
import DailySchedule from "@/components/Calendar/DailySchedule";
import Notepad from "@/components/Notepad";
import MedicalResources from "@/components/MedicalResources";
import EventModal from "@/components/Calendar/EventModal";
import { useCalendar } from "@/contexts/CalendarContext";
import { formatDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { selectedDate, isModalOpen, setIsModalOpen } = useCalendar();
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
        {/* Top navigation */}
        <header className="bg-white shadow-sm py-3 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-3" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-xl font-semibold">Medical Calendar</h1>
              <p className="text-sm text-muted-foreground">{formatDate(selectedDate, 'MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button className="hidden sm:flex" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Event
            </Button>
            <Button size="icon" className="sm:hidden" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        {/* Calendar container */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar and Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <CalendarView />
              <DailySchedule />
            </div>
            
            {/* Right sidebar with notepad */}
            <div className="space-y-6">
              <Notepad />
              <MedicalResources />
            </div>
          </div>
        </div>
      </main>
      
      {/* Event Modal */}
      <EventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
