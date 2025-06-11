import { 
  users, 
  savedTables, 
  customThemes,
  type User, 
  type InsertUser,
  type SavedTable,
  type InsertSavedTable,
  type CustomTheme,
  type InsertCustomTheme
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Saved tables methods
  getSavedTable(id: number): Promise<SavedTable | undefined>;
  getUserSavedTables(userId: number): Promise<SavedTable[]>;
  getPublicSavedTables(): Promise<SavedTable[]>;
  createSavedTable(table: InsertSavedTable): Promise<SavedTable>;
  updateSavedTable(id: number, userId: number, updates: Partial<InsertSavedTable>): Promise<SavedTable | undefined>;
  deleteSavedTable(id: number, userId: number): Promise<boolean>;
  
  // Custom themes methods
  getCustomTheme(id: number): Promise<CustomTheme | undefined>;
  getUserCustomThemes(userId: number): Promise<CustomTheme[]>;
  getPublicCustomThemes(): Promise<CustomTheme[]>;
  createCustomTheme(theme: InsertCustomTheme): Promise<CustomTheme>;
  deleteCustomTheme(id: number, userId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
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

  // Saved tables methods
  async getSavedTable(id: number): Promise<SavedTable | undefined> {
    const [table] = await db.select().from(savedTables).where(eq(savedTables.id, id));
    return table || undefined;
  }

  async getUserSavedTables(userId: number): Promise<SavedTable[]> {
    return await db.select().from(savedTables).where(eq(savedTables.userId, userId));
  }

  async getPublicSavedTables(): Promise<SavedTable[]> {
    return await db.select().from(savedTables).where(eq(savedTables.isPublic, true));
  }

  async createSavedTable(table: InsertSavedTable): Promise<SavedTable> {
    const [savedTable] = await db
      .insert(savedTables)
      .values(table)
      .returning();
    return savedTable;
  }

  async updateSavedTable(id: number, userId: number, updates: Partial<InsertSavedTable>): Promise<SavedTable | undefined> {
    const [updatedTable] = await db
      .update(savedTables)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(savedTables.id, id), eq(savedTables.userId, userId)))
      .returning();
    return updatedTable || undefined;
  }

  async deleteSavedTable(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(savedTables)
      .where(and(eq(savedTables.id, id), eq(savedTables.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Custom themes methods
  async getCustomTheme(id: number): Promise<CustomTheme | undefined> {
    const [theme] = await db.select().from(customThemes).where(eq(customThemes.id, id));
    return theme || undefined;
  }

  async getUserCustomThemes(userId: number): Promise<CustomTheme[]> {
    return await db.select().from(customThemes).where(eq(customThemes.userId, userId));
  }

  async getPublicCustomThemes(): Promise<CustomTheme[]> {
    return await db.select().from(customThemes).where(eq(customThemes.isPublic, true));
  }

  async createCustomTheme(theme: InsertCustomTheme): Promise<CustomTheme> {
    const [customTheme] = await db
      .insert(customThemes)
      .values(theme)
      .returning();
    return customTheme;
  }

  async deleteCustomTheme(id: number, userId: number): Promise<boolean> {
    const result = await db
      .delete(customThemes)
      .where(and(eq(customThemes.id, id), eq(customThemes.userId, userId)));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
