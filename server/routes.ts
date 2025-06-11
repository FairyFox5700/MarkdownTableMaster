import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { insertSavedTableSchema, insertCustomThemeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Saved Tables endpoints
  app.get("/api/tables", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      const isPublic = req.query.public === 'true';
      
      let tables;
      if (isPublic) {
        tables = await storage.getPublicSavedTables();
      } else if (userId) {
        tables = await storage.getUserSavedTables(userId);
      } else {
        return res.status(400).json({ error: "userId required for private tables" });
      }
      
      res.json(tables);
    } catch (error) {
      log(`Error fetching tables: ${error}`, "api");
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/tables/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const table = await storage.getSavedTable(id);
      if (table) {
        res.json(table);
      } else {
        res.status(404).json({ error: "Table not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/tables", async (req, res) => {
    try {
      const validatedData = insertSavedTableSchema.parse(req.body);
      const table = await storage.createSavedTable(validatedData);
      res.status(201).json(table);
    } catch (error) {
      log(`Error creating table: ${error}`, "api");
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  app.put("/api/tables/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.body.userId;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const updates = insertSavedTableSchema.partial().parse(req.body);
      delete (updates as any).userId;
      
      const updatedTable = await storage.updateSavedTable(id, userId, updates);
      if (updatedTable) {
        res.json(updatedTable);
      } else {
        res.status(404).json({ error: "Table not found or not authorized" });
      }
    } catch (error) {
      log(`Error updating table: ${error}`, "api");
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  app.delete("/api/tables/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.body.userId;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const deleted = await storage.deleteSavedTable(id, userId);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Table not found or not authorized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Custom Themes endpoints
  app.get("/api/themes", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
      const isPublic = req.query.public === 'true';
      
      let themes;
      if (isPublic) {
        themes = await storage.getPublicCustomThemes();
      } else if (userId) {
        themes = await storage.getUserCustomThemes(userId);
      } else {
        return res.status(400).json({ error: "userId required for private themes" });
      }
      
      res.json(themes);
    } catch (error) {
      log(`Error fetching themes: ${error}`, "api");
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/themes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const theme = await storage.getCustomTheme(id);
      if (theme) {
        res.json(theme);
      } else {
        res.status(404).json({ error: "Theme not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/themes", async (req, res) => {
    try {
      const validatedData = insertCustomThemeSchema.parse(req.body);
      const theme = await storage.createCustomTheme(validatedData);
      res.status(201).json(theme);
    } catch (error) {
      log(`Error creating theme: ${error}`, "api");
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  app.delete("/api/themes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.body.userId;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const deleted = await storage.deleteCustomTheme(id, userId);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Theme not found or not authorized" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const server = createServer(app);
  return server;
}
