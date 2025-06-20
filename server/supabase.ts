import { createClient } from '@supabase/supabase-js';
import { environment } from './config';

// Environment variables should be set in .env file
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Only require Supabase credentials in production
if (environment.isProduction && (!supabaseUrl || !supabaseKey)) {
  console.error('Missing Supabase credentials in production environment. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file.');
}

// Create a mock Supabase client for development
function createMockSupabaseClient() {
  console.log('🧩 Creating mock Supabase client for development');
  
  // This is a simplified mock that can be expanded as needed
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: null })
        }),
        async then() { return { data: [], error: null }; }
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({ data, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => ({ data, error: null })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          async then() { return { data: null, error: null }; }
        })
      })
    })
  };
}

// Create Supabase client (or a mock client for development if credentials aren't available)
export const supabase = (environment.isProduction && supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : createMockSupabaseClient();

// Helper function to check connection
export async function checkSupabaseConnection() {
  // In development with mock client, we'll just return true
  if (!environment.isProduction) {
    console.log('🧪 Using mock Supabase client in development - no connection check needed');
    return true;
  }
  
  try {
    // Only do an actual connection test in production
    if (supabaseUrl && supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
      if (response.ok) {
        console.log('✅ Supabase connection successful');
        return true;
      }
      throw new Error(`Connection failed with status: ${response.status}`);
    } else {
      throw new Error('Missing Supabase credentials');
    }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}
