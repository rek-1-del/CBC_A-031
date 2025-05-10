import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Clock,
  User,
  Bell,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import Weather from "@/components/Weather";
import SearchBar from "@/components/SearchBar";
import ResourceLinks from "@/components/ResourceLinks";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`w-64 bg-white shadow-lg h-full flex flex-col z-30 ${
        isOpen ? "fixed left-0 md:relative" : "fixed -left-full md:-ml-64"
      } transition-all duration-300`}
    >
      {/* Logo and profile section */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-primary">MedSchedule</h1>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
            alt="Doctor profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">Dr. Sarah Johnson</p>
            <p className="text-sm text-muted-foreground">Cardiologist</p>
          </div>
        </div>
      </div>

      {/* Sidebar navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
        {/* AI Search */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
            Search
          </h2>
          <SearchBar />
        </div>

        {/* Calendar Navigation */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
            Calendar
          </h2>
          <ul className="space-y-1">
            <li>
              <Link href="/">
                <a className="flex items-center px-3 py-2 text-sm rounded-md bg-primary bg-opacity-10 text-primary">
                  <Calendar className="h-4 w-4 mr-2" /> Calendar
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 text-neutral-700">
                  <Clock className="h-4 w-4 mr-2" /> Today's Schedule
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 text-neutral-700">
                  <User className="h-4 w-4 mr-2" /> Patients
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 text-neutral-700">
                  <Bell className="h-4 w-4 mr-2" /> Notifications
                </a>
              </Link>
            </li>
          </ul>
        </div>

        {/* Medical Resources */}
        <ResourceLinks />
      </nav>

      {/* Weather widget */}
      <div className="p-4 border-t border-neutral-200">
        <Weather />
      </div>
    </aside>
  );
}
