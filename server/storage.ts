import { users, type User, type InsertUser } from "@shared/schema";
import { userProfiles, type UserProfile, type InsertUserProfile } from "@shared/schema";
import { events, type Event, type InsertEvent } from "@shared/schema";
import { notes, type Note, type InsertNote } from "@shared/schema";
import { isSameDay } from "date-fns";
import { db } from "./db";
import { eq, gte, desc, and, sql } from "drizzle-orm";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User Profile methods
  getUserProfiles(): Promise<UserProfile[]>;
  getUserProfileById(id: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(id: number, profile: InsertUserProfile): Promise<UserProfile | undefined>;
  
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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }
  
  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }
  
  async getEventsByDate(date: Date): Promise<Event[]> {
    // Get all events on the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db.select().from(events)
      .where(
        and(
          gte(events.startTime, startOfDay),
          sql`${events.startTime} < ${endOfDay}`
        )
      );
  }
  
  async getUpcomingEvents(fromDate: Date, limit: number = 3): Promise<Event[]> {
    return await db.select().from(events)
      .where(gte(events.startTime, fromDate))
      .orderBy(events.startTime)
      .limit(limit);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }
  
  async updateEvent(id: number, updateData: InsertEvent): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(updateData)
      .where(eq(events.id, id))
      .returning();
    
    return updatedEvent || undefined;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    const [deletedEvent] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();
    
    return !!deletedEvent;
  }
  
  // Note methods
  async getAllNotes(): Promise<Note[]> {
    return await db.select().from(notes);
  }
  
  async getNoteById(id: number): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note || undefined;
  }
  
  async getNoteByDate(date: Date): Promise<Note | undefined> {
    // Get the note from the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const [note] = await db.select().from(notes)
      .where(
        and(
          gte(notes.date, startOfDay.toISOString()),
          sql`${notes.date} < ${endOfDay.toISOString()}`
        )
      );
    
    return note || undefined;
  }
  
  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values(insertNote)
      .returning();
    
    return note;
  }
  
  async updateNote(id: number, updateData: InsertNote): Promise<Note | undefined> {
    const [updatedNote] = await db
      .update(notes)
      .set(updateData)
      .where(eq(notes.id, id))
      .returning();
    
    return updatedNote || undefined;
  }
  
  async deleteNote(id: number): Promise<boolean> {
    const [deletedNote] = await db
      .delete(notes)
      .where(eq(notes.id, id))
      .returning();
    
    return !!deletedNote;
  }
}

// Initialize with demo data
async function initializeDatabase() {
  // Check if the database already has users
  const existingUsers = await db.select().from(users);
  
  if (existingUsers.length === 0) {
    // Add a demo user
    await db.insert(users).values({
      username: "doctor",
      password: "password123",
      fullName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
    });
    
    // Add a demo note
    const today = new Date();
    await db.insert(notes).values({
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
  }
}

// Initialize database with demo data
initializeDatabase().catch(console.error);

export const storage = new DatabaseStorage();
