import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  specialty: text("specialty"),
  avatarUrl: text("avatar_url"),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  specialty: text("specialty"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  eventType: text("event_type").notNull(),
  participants: text("participants"),
  hasReminder: boolean("has_reminder").default(false),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  content: text("content").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  specialty: true,
  avatarUrl: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  fullName: true,
  email: true,
  specialty: true,
  avatarUrl: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  userId: true,
  title: true,
  description: true,
  startTime: true,
  endTime: true,
  location: true,
  eventType: true,
  participants: true,
  hasReminder: true,
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  userId: true,
  date: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// Event types for UI display
export const eventTypes = [
  { value: "meeting", label: "Meeting", color: "primary" },
  { value: "consultation", label: "Patient Consultation", color: "error" },
  { value: "surgery", label: "Surgery", color: "error" },
  { value: "conference", label: "Conference", color: "secondary" },
  { value: "webinar", label: "Webinar", color: "accent" },
  { value: "break", label: "Break", color: "warning" },
  { value: "rounds", label: "Patient Rounds", color: "secondary" },
  { value: "personal", label: "Personal", color: "neutral" },
  { value: "research", label: "Research", color: "primary" },
  { value: "other", label: "Other", color: "neutral" },
];
