import { supabase } from './supabase';
import { InsertUser, InsertSavedTable, InsertCustomTheme } from "@shared/schema";

// A helper function to handle the thenable/promise inconsistency
function wrapSupabaseQuery<T>(query: any): Promise<T> {
  return new Promise((resolve, reject) => {
    // Use setTimeout to escape from TypeScript's type checking
    // This is a hacky workaround for the TypeScript errors we're experiencing
    setTimeout(() => {
      try {
        query.then((result: any) => {
          if (result.error) reject(result.error);
          else resolve(result.data as T);
        }).catch(reject);
      } catch (err) {
        reject(err);
      }
    }, 0);
  });
}

// Supabase wrapper for database operations
export const db = {
  // Direct access to Supabase client for complex queries
  supabase,
  
  // Users operations
  users: {
    async findAll() {
      try {
        return await wrapSupabaseQuery(supabase.from('users').select('*'));
      } catch (error) {
        console.error("Error finding all users:", error);
        throw error;
      }
    },
    
    async findById(id: number) {
      try {
        return await wrapSupabaseQuery(
          supabase.from('users').select('*').eq('id', id).single()
        ).catch(error => {
          if (error.code === 'PGRST116') return null; // No rows returned
          throw error;
        });
      } catch (error) {
        console.error(`Error finding user by ID ${id}:`, error);
        throw error;
      }
    },
    
    async findByUsername(username: string) {
      try {
        return await wrapSupabaseQuery(
          supabase.from('users').select('*').eq('username', username).single()
        ).catch(error => {
          if (error.code === 'PGRST116') return null; // No rows returned
          throw error;
        });
      } catch (error) {
        console.error(`Error finding user by username ${username}:`, error);
        throw error;
      }
    },
    
    async create(user: InsertUser) {
      try {
        return await wrapSupabaseQuery(
          supabase.from('users').insert(user).select().single()
        );
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    }
  },
  
  // Saved tables operations
  savedTables: {
    async findAll(userId?: number) {
      try {
        if (userId) {
          return await wrapSupabaseQuery(
            supabase.from('saved_tables').select('*').eq('user_id', userId)
          );
        } else {
          return await wrapSupabaseQuery(
            supabase.from('saved_tables').select('*')
          );
        }
      } catch (error) {
        console.error("Error finding saved tables:", error);
        throw error;
      }
    },
    
    async findById(id: number) {
      try {
        return await wrapSupabaseQuery(
          supabase.from('saved_tables').select('*').eq('id', id).single()
        );
      } catch (error) {
        console.error(`Error finding saved table by ID ${id}:`, error);
        throw error;
      }
    },
    
    async create(table: InsertSavedTable) {
      try {
        return await wrapSupabaseQuery(
          supabase.from('saved_tables').insert(table).select().single()
        );
      } catch (error) {
        console.error("Error creating saved table:", error);
        throw error;
      }
    },
    
    async update(id: number, table: Partial<InsertSavedTable>) {
      try {
        return await wrapSupabaseQuery(
          supabase
            .from('saved_tables')
            .update({
              ...table, 
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()
        );
      } catch (error) {
        console.error(`Error updating saved table with ID ${id}:`, error);
        throw error;
      }
    },
    
    async delete(id: number) {
      try {
        await wrapSupabaseQuery(
          supabase.from('saved_tables').delete().eq('id', id)
        );
        return true;
      } catch (error) {
        console.error(`Error deleting saved table with ID ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Custom themes operations
  customThemes: {
    async findAll(userId?: number) {
      try {
        if (userId) {
          return await wrapSupabaseQuery(
            supabase.from('custom_themes').select('*').eq('user_id', userId)
          );
        } else {
          return await wrapSupabaseQuery(
            supabase.from('custom_themes').select('*')
          );
        }
      } catch (error) {
        console.error("Error finding custom themes:", error);
        throw error;
      }
    },
    
    async create(theme: InsertCustomTheme) {
      try {
        return await wrapSupabaseQuery(
          supabase.from('custom_themes').insert(theme).select().single()
        );
      } catch (error) {
        console.error("Error creating custom theme:", error);
        throw error;
      }
    },
    
    async delete(id: number) {
      try {
        await wrapSupabaseQuery(
          supabase.from('custom_themes').delete().eq('id', id)
        );
        return true;
      } catch (error) {
        console.error(`Error deleting custom theme with ID ${id}:`, error);
        throw error;
      }
    }
  }
};