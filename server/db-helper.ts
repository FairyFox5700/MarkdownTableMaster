/**
 * Helper functions for working with the Supabase client
 * This resolves TypeScript issues with the Supabase query builder
 */

/**
 * Execute a Supabase query and handle the TypeScript issues
 * @param query - The Supabase query to execute
 * @returns A promise that resolves to the data from the query
 */
export function executeSupabaseQuery<T>(query: any): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // Use setTimeout to escape from TypeScript's type checking
    setTimeout(() => {
      try {
        // @ts-ignore - TypeScript doesn't recognize the then method on Supabase query objects
        query.then((result: any) => {
          if (result.error) reject(result.error);
          else resolve(result.data as T);
        }).catch((err: any) => reject(err));
      } catch (err) {
        reject(err);
      }
    }, 0);
  });
}

/**
 * Check if a record belongs to a user
 * @param tableName - The name of the table to check
 * @param id - The ID of the record to check
 * @param userId - The ID of the user to check
 * @param supabase - The Supabase client
 * @returns A promise that resolves to true if the record belongs to the user
 */
export async function checkRecordOwnership(
  tableName: string,
  id: number,
  userId: number,
  supabase: any
): Promise<boolean> {
  try {
    const data = await executeSupabaseQuery<any[]>(
      supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
    );
    
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error(`Error checking record ownership for ${tableName} ${id}:`, error);
    return false;
  }
}
