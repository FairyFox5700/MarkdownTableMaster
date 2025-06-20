# MarkdownTableMaster

A powerful application for creating, styling, and managing Markdown tables with AI-powered style suggestions.

## Environment Setup

This project is configured to use:
- **Development Mode**: Local PostgreSQL database (via Docker)
- **Production Mode**: Supabase cloud database

## Quick Start

### For Windows Users

Run the environment switcher script:
```
run.bat
```

This will present you with options to choose development or production mode.

### Manual Setup

1. **Set up your environment**:
   - Development: 
     ```bash
     docker-compose up -d
     npm run dev
     ```
   - Production:
     ```bash
     NODE_ENV=production npm run dev
     # Or on Windows:
     set NODE_ENV=production && npm run dev
     ```

2. **Access the application**: Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configure Environment Variables

The `.env` file contains configuration for both environments:

```
# Development Database Configuration (Local)
DEV_DATABASE_URL=postgres://postgres:postgres@localhost:5432/markdowntablemaster

# Production Database Configuration (Supabase)
PROD_DATABASE_URL=postgresql://postgres:your-password@your-project-ref.supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

For production, you'll need to:
1. Create an account on [Supabase](https://supabase.com)
2. Create a new project
3. Update the `.env` file with your project's credentials

## Features

- Create and edit Markdown tables
- Apply custom styling to tables
- Drag-and-drop rows and columns to reorder them
- Save and load table designs
- Export tables in various formats
- Theme gallery with 35+ pre-built styles and custom sorting

## Theme Gallery

The Theme Gallery includes 35+ pre-built themes that you can apply to your tables with a single click:

### Theme Gallery Features:

1. **Rich Selection**: Choose from various theme categories including Professional, Dark, Nature, Warm, and Vibrant themes.
2. **Drag-and-Drop Sorting**: Arrange themes in your preferred order by dragging and dropping them.
3. **Category Filtering**: Filter themes by category to quickly find what you're looking for.
4. **Search Capability**: Search themes by name to locate specific styles.
5. **Persistent Sorting**: Your custom theme order is saved between sessions.

### Available Theme Categories:

- **Professional**: Corporate, Newspaper, Arctic, Steel, Monochrome, Elegant
- **Dark**: Dark Mode, Midnight, Tech Noir, Cyberpunk
- **Nature**: Ocean Blue, Forest Green, Fresh Mint, Emerald Green, Sage Green, Nautical Blue, Winter Frost
- **Warm**: Sunset Orange, Golden Yellow, Amber Orange, Crimson Red, Desert Sand, Autumn Leaves, Coffee Bean, Vintage Paper
- **Vibrant**: Lavender Purple, Royal Blue, Soft Pink, Rose Pink, Pastel Pink, Neon Green, Cherry Blossom, Candy Pop, Retro Console

## Detailed Setup

For more detailed setup instructions, see [SETUP.md](SETUP.md).

## Development

- **Frontend**: React with TypeScript, using Shadcn/UI components
- **Backend**: Express API with PostgreSQL database
- **Storage Options**: Docker PostgreSQL (dev) or Supabase (production)

## Drag-and-Drop Feature

The application now supports drag-and-drop functionality for reordering rows and columns in your tables:

### How to use:

1. **Reorder rows**: 
   - Grab the vertical grip handle (⋮) at the left side of any row
   - Drag up or down to reposition the row
   - The markdown content will automatically update to reflect the new order

2. **Reorder columns**:
   - Grab the horizontal grip handle (≡) at the top of any column in the table header
   - Drag left or right to reposition the column
   - The markdown content will automatically update to reflect the new order

This feature makes it easy to experiment with different table layouts without having to manually edit the markdown.
