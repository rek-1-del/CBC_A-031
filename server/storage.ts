import { users, type User, type InsertUser } from "@shared/schema";
import { events, type Event, type InsertEvent } from "@shared/schema";
import { notes, type Note, type InsertNote } from "@shared/schema";
import { isSameDay } from "date-fns";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getAllEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  getEventsByDate(date: Date): Promise<Event[]>;
  getUpcomingEvents(fromDate: Date, limit?: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: InsertEvent): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Note methods
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: number): Promise<Note | undefined>;
  getNoteByDate(date: Date): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: InsertNote): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private notes: Map<number, Note>;
  
  private userIdCounter: number;
  private eventIdCounter: number;
  private noteIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.notes = new Map();
    
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.noteIdCounter = 1;
    
    // Add demo user
    this.users.set(1, {
      id: 1,
      username: "doctor",
      password: "password123",
      fullName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
    });
    
    // Add demo events
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    
    // Research Meeting
    this.events.set(1, {
      id: 1,
      userId: 1,
      title: "Research Meeting",
      description: "Discussion with research team on new clinical trial findings",
      startTime: new Date(todayStart.getTime() + 8 * 60 * 60 * 1000), // 8 AM
      endTime: new Date(todayStart.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
      location: "Conference Room B",
      eventType: "research",
      participants: "team@hospital.org",
      hasReminder: true
    });
    
    // Patient Consultation
    this.events.set(2, {
      id: 2,
      userId: 1,
      title: "Patient Consultation",
      description: "Follow-up with Mr. John Doe - Post-op check",
      startTime: new Date(todayStart.getTime() + 10 * 60 * 60 * 1000), // 10 AM
      endTime: new Date(todayStart.getTime() + 10.5 * 60 * 60 * 1000), // 10:30 AM
      location: "Office #3",
      eventType: "consultation",
      participants: "",
      hasReminder: true
    });
    
    // Lunch Break
    this.events.set(3, {
      id: 3,
      userId: 1,
      title: "Lunch Break",
      description: "Personal time",
      startTime: new Date(todayStart.getTime() + 12 * 60 * 60 * 1000), // 12 PM
      endTime: new Date(todayStart.getTime() + 13 * 60 * 60 * 1000), // 1 PM
      location: "",
      eventType: "break",
      participants: "",
      hasReminder: false
    });
    
    // Team Review
    this.events.set(4, {
      id: 4,
      userId: 1,
      title: "Team Review",
      description: "Weekly department case review session",
      startTime: new Date(todayStart.getTime() + 13 * 60 * 60 * 1000), // 1 PM
      endTime: new Date(todayStart.getTime() + 14.5 * 60 * 60 * 1000), // 2:30 PM
      location: "Main Conference Room",
      eventType: "meeting",
      participants: "department@hospital.org",
      hasReminder: true
    });
    
    // Patient Rounds
    this.events.set(5, {
      id: 5,
      userId: 1,
      title: "Patient Rounds",
      description: "Evening rounds with nursing staff",
      startTime: new Date(todayStart.getTime() + 16 * 60 * 60 * 1000), // 4 PM
      endTime: new Date(todayStart.getTime() + 17.5 * 60 * 60 * 1000), // 5:30 PM
      location: "Ward 3",
      eventType: "rounds",
      participants: "nursing@hospital.org",
      hasReminder: true
    });
    
    // Upcoming events
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    
    // Conference
    this.events.set(6, {
      id: 6,
      userId: 1,
      title: "Conference - New Cardiac Procedures",
      description: "Annual cardiology conference",
      startTime: new Date(todayStart.getTime() + (24 * 7 + 9) * 60 * 60 * 1000), // 7 days later, 9 AM
      endTime: new Date(todayStart.getTime() + (24 * 7 + 17) * 60 * 60 * 1000), // 7 days later, 5 PM
      location: "Medical Convention Center",
      eventType: "conference",
      participants: "",
      hasReminder: true
    });
    
    // Webinar
    this.events.set(7, {
      id: 7,
      userId: 1,
      title: "Journal Club Webinar",
      description: "Discussion of recent medical journal publications",
      startTime: new Date(todayStart.getTime() + (24 * 5 + 19) * 60 * 60 * 1000), // 5 days later, 7 PM
      endTime: new Date(todayStart.getTime() + (24 * 5 + 20.5) * 60 * 60 * 1000), // 5 days later, 8:30 PM
      location: "Online (Zoom)",
      eventType: "webinar",
      participants: "journal-club@hospital.org",
      hasReminder: true
    });
    
    // Surgery
    this.events.set(8, {
      id: 8,
      userId: 1,
      title: "Specialized Surgery",
      description: "Cardiac procedure for Patient ID 12345",
      startTime: new Date(todayStart.getTime() + (24 * 2 + 10) * 60 * 60 * 1000), // 2 days later, 10 AM
      endTime: new Date(todayStart.getTime() + (24 * 2 + 14) * 60 * 60 * 1000), // 2 days later, 2 PM
      location: "Operating Theater 2",
      eventType: "surgery",
      participants: "surgery-team@hospital.org",
      hasReminder: true
    });
    
    // Add demo note for today
    this.notes.set(1, {
      id: 1,
      userId: 1,
      date: today,
      content: `
        <p><b>Research Meeting Notes:</b></p>
        <p>- Discuss progress on cardiac study</p>
        <p>- Review latest literature on hypertension treatment</p>
        <p>- Plan next phase of clinical trials</p>
        <p>- Assign tasks to team members</p>
        <br>
        <p><b>Patient Follow-up:</b></p>
        <p>- Check Mr. Doe's recovery progress</p>
        <p>- Update treatment plan if necessary</p>
        <p>- Schedule next appointment</p>
      `
    });
    
    this.eventIdCounter = 9; // Set after initializing demo events
    this.noteIdCounter = 2; // Set after initializing demo notes
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getEventsByDate(date: Date): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => 
      isSameDay(new Date(event.startTime), date)
    );
  }
  
  async getUpcomingEvents(fromDate: Date, limit: number = 3): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => new Date(event.startTime) >= fromDate)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, limit);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, updateData: InsertEvent): Promise<Event | undefined> {
    const event = this.events.get(id);
    
    if (!event) {
      return undefined;
    }
    
    const updatedEvent: Event = { ...updateData, id };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
  
  // Note methods
  async getAllNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }
  
  async getNoteById(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }
  
  async getNoteByDate(date: Date): Promise<Note | undefined> {
    return Array.from(this.notes.values()).find(note => 
      isSameDay(new Date(note.date), date)
    );
  }
  
  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.noteIdCounter++;
    const note: Note = { ...insertNote, id };
    this.notes.set(id, note);
    return note;
  }
  
  async updateNote(id: number, updateData: InsertNote): Promise<Note | undefined> {
    const note = this.notes.get(id);
    
    if (!note) {
      return undefined;
    }
    
    const updatedNote: Note = { ...updateData, id };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }
  
  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }
}

export const storage = new MemStorage();
