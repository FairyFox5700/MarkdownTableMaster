// Set up the correct DATABASE_URL based on environment
const NODE_ENV = process.env.NODE_ENV || 'development';

// Select the appropriate database URL based on environment
if (NODE_ENV === 'production') {
  // Use Supabase in production
  process.env.DATABASE_URL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
  console.log('🌐 Using production database (Supabase)');
} else {
  // Use local Docker PostgreSQL in development
  process.env.DATABASE_URL = process.env.DEV_DATABASE_URL || process.env.DATABASE_URL;
  console.log('🧪 Using development database (Local)');
}

// Export the configured environment for use in other modules
export const environment = {
  NODE_ENV,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
  DATABASE_URL: process.env.DATABASE_URL,
};
