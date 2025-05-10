import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertNoteSchema } from "@shared/schema";
import { format, parseISO } from "date-fns";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Events API
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  
  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const today = new Date();
      const events = await storage.getUpcomingEvents(today);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });
  
  app.get("/api/events/:date", async (req, res) => {
    try {
      const date = parseISO(req.params.date);
      const events = await storage.getEventsByDate(date);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events for date" });
    }
  });
  
  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid event data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create event" });
      }
    }
  });
  
  app.patch("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventData = insertEventSchema.parse(req.body);
      const updatedEvent = await storage.updateEvent(id, eventData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid event data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update event" });
      }
    }
  });
  
  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });
  
  // Notes API
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getAllNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });
  
  app.get("/api/notes/:date", async (req, res) => {
    try {
      const date = parseISO(req.params.date);
      const note = await storage.getNoteByDate(date);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });
  
  app.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse(req.body);
      const newNote = await storage.createNote(noteData);
      res.status(201).json(newNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid note data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create note" });
      }
    }
  });
  
  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const noteData = insertNoteSchema.parse(req.body);
      const updatedNote = await storage.updateNote(id, noteData);
      
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(updatedNote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid note data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update note" });
      }
    }
  });
  
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNote(id);
      
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });
  
  // Google Search API
  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // Import dynamically to avoid module loading issues
      const { performGoogleSearch } = await import('./googleSearch');
      
      try {
        const results = await performGoogleSearch(query);
        res.json({ results });
      } catch (searchError) {
        console.error("Google search error:", searchError);
        res.status(500).json({ message: "Search failed. Please try again later." });
      }
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ message: "Failed to process search query" });
    }
  });
  
  // Weather API proxy
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      // Mock weather data for demonstration
      // In a real implementation, this would call the AccuWeather API
      const weatherData = {
        location: "New York, NY",
        date: format(new Date(), "EEE, d MMM"),
        temperature: 22,
        conditions: "Partly Cloudy",
        icon: "4",
      };
      
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
