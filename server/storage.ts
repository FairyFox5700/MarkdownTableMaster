import { 
  type User, 
  type InsertUser,
  type SavedTable,
  type InsertSavedTable,
  type CustomTheme,
  type InsertCustomTheme
} from "@shared/schema";
import { db } from "./db";
import { executeSupabaseQuery, checkRecordOwnership } from "./db-helper";

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

export class SupabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const data = await db.users.findById(id);
      return data as User || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const data = await db.users.findByUsername(username);
      return data as User || undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const data = await db.users.create(insertUser);
      return data as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async getSavedTable(id: number): Promise<SavedTable | undefined> {
    try {
      const data = await db.savedTables.findById(id);
      return data as SavedTable || undefined;
    } catch (error) {
      console.error("Error getting saved table:", error);
      return undefined;
    }
  }
  
  async getUserSavedTables(userId: number): Promise<SavedTable[]> {
    try {
      const data = await db.savedTables.findAll(userId);
      return data as SavedTable[];
    } catch (error) {
      console.error("Error getting user saved tables:", error);
      return [];
    }
  }
  
  async getPublicSavedTables(): Promise<SavedTable[]> {
    try {
      const data = await executeSupabaseQuery<SavedTable[]>(
        db.supabase.from('saved_tables').select('*').eq('is_public', true)
      );
      
      return data;
    } catch (error) {
      console.error("Error getting public saved tables:", error);
      return [];
    }
  }
  
  async createSavedTable(table: InsertSavedTable): Promise<SavedTable> {
    try {
      const data = await db.savedTables.create(table);
      return data as SavedTable;
    } catch (error) {
      console.error("Error creating saved table:", error);
      throw error;
    }
  }
  
  async updateSavedTable(id: number, userId: number, updates: Partial<InsertSavedTable>): Promise<SavedTable | undefined> {
    try {
      // First check that the table belongs to the user
      const hasAccess = await checkRecordOwnership('saved_tables', id, userId, db.supabase);
      if (!hasAccess) return undefined;
      
      const data = await db.savedTables.update(id, updates);
      return data as SavedTable;
    } catch (error) {
      console.error("Error updating saved table:", error);
      return undefined;
    }
  }
  
  async deleteSavedTable(id: number, userId: number): Promise<boolean> {
    try {
      // First check that the table belongs to the user
      const hasAccess = await checkRecordOwnership('saved_tables', id, userId, db.supabase);
      if (!hasAccess) return false;
      
      await db.savedTables.delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting saved table:", error);
      return false;
    }
  }
  
  async getCustomTheme(id: number): Promise<CustomTheme | undefined> {
    try {
      const data = await executeSupabaseQuery<CustomTheme>(
        db.supabase.from('custom_themes').select('*').eq('id', id).single()
      );
      return data;
    } catch (error) {
      console.error("Error getting custom theme:", error);
      return undefined;
    }
  }
  
  async getUserCustomThemes(userId: number): Promise<CustomTheme[]> {
    try {
      const data = await db.customThemes.findAll(userId);
      return data as CustomTheme[];
    } catch (error) {
      console.error("Error getting user custom themes:", error);
      return [];
    }
  }
  
  async getPublicCustomThemes(): Promise<CustomTheme[]> {
    try {
      const data = await executeSupabaseQuery<CustomTheme[]>(
        db.supabase.from('custom_themes').select('*').eq('is_public', true)
      );
      return data;
    } catch (error) {
      console.error("Error getting public custom themes:", error);
      return [];
    }
  }
  
  async createCustomTheme(theme: InsertCustomTheme): Promise<CustomTheme> {
    try {
      const data = await db.customThemes.create(theme);
      return data as CustomTheme;
    } catch (error) {
      console.error("Error creating custom theme:", error);
      throw error;
    }
  }
  
  async deleteCustomTheme(id: number, userId: number): Promise<boolean> {
    try {
      // First check that the theme belongs to the user
      const hasAccess = await checkRecordOwnership('custom_themes', id, userId, db.supabase);
      if (!hasAccess) return false;
      
      await db.customThemes.delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting custom theme:", error);
      return false;
    }
  }
}

export const storage: IStorage = new SupabaseStorage();
