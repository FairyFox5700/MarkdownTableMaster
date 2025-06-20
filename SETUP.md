# MarkdownTableMaster Setup Guide

This guide will help you set up your MarkdownTableMaster project, including your database options.

## Option 1: Local Development with Docker

The project includes a Docker Compose file that sets up a PostgreSQL database for local development.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Start the Database

1. Open a terminal in the project root
2. Run the PostgreSQL container:
   ```
   docker-compose up -d
   ```
3. The database will be available at `postgres://postgres:postgres@localhost:5432/markdowntablemaster`

### Configure the Application

1. Make sure your `.env` file contains:
   ```
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/markdowntablemaster
   ```

## Option 2: Supabase (Cloud Database)

Supabase provides a free PostgreSQL database with authentication, storage, and more.

### Setting Up Supabase

1. Sign up at [supabase.com](https://supabase.com/)
2. Create a new project
3. Choose a name and password for your project
4. Once your project is ready, navigate to Settings > API
5. Get your project URL and API keys

### Configure the Application

1. Update your `.env` file with Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   DATABASE_URL=postgresql://postgres:your-db-password@your-project-ref.supabase.co:5432/postgres
   ```
2. Replace placeholders with actual values from your Supabase dashboard

### Setting Up Database Schema 

1. In the Supabase Dashboard, go to SQL Editor
2. Run the following SQL to create your tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Create saved_tables table
CREATE TABLE IF NOT EXISTS saved_tables (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  name TEXT NOT NULL,
  markdown_content TEXT NOT NULL,
  styles JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create custom_themes table
CREATE TABLE IF NOT EXISTS custom_themes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  name TEXT NOT NULL,
  styles JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Starting the Application

After setting up your database (either local Docker or Supabase):

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser at `http://localhost:3000` (or whatever port is shown in the terminal)

## Additional Configuration

### OpenAI (for AI Suggestions)

To enable AI-powered table style suggestions:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```
