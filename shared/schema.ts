import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const savedTables = pgTable("saved_tables", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  markdownContent: text("markdown_content").notNull(),
  styles: json("styles").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customThemes = pgTable("custom_themes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  styles: json("styles").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSavedTableSchema = createInsertSchema(savedTables).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomThemeSchema = createInsertSchema(customThemes).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SavedTable = typeof savedTables.$inferSelect;
export type InsertSavedTable = z.infer<typeof insertSavedTableSchema>;
export type CustomTheme = typeof customThemes.$inferSelect;
export type InsertCustomTheme = z.infer<typeof insertCustomThemeSchema>;
