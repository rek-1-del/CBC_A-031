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
    
    // No predefined events per user request
    const today = new Date(); // Keep this for the notes
    
    // Add demo note for today
    this.notes.set(1, {
      id: 1,
      userId: 1,
      date: today.toISOString(),
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
    
    this.eventIdCounter = 1; // Start from 1 as we removed demo events
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
    const user: User = { 
      ...insertUser, 
      id,
      specialty: insertUser.specialty || null,
      avatarUrl: insertUser.avatarUrl || null 
    };
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
    const event: Event = { 
      ...insertEvent, 
      id,
      description: insertEvent.description || null,
      location: insertEvent.location || null,
      participants: insertEvent.participants || null,
      hasReminder: insertEvent.hasReminder || null
    };
    this.events.set(id, event);
    return event;
  }
  
  async updateEvent(id: number, updateData: InsertEvent): Promise<Event | undefined> {
    const event = this.events.get(id);
    
    if (!event) {
      return undefined;
    }
    
    const updatedEvent: Event = { 
      ...updateData, 
      id,
      description: updateData.description || null,
      location: updateData.location || null,
      participants: updateData.participants || null,
      hasReminder: updateData.hasReminder || null
    };
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
