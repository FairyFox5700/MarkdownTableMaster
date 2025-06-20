# Deploying to Vercel

This guide will walk you through the process of deploying your MarkdownTableMaster application to Vercel.

## Prerequisites

1. You need a [Vercel account](https://vercel.com/signup)
2. [Node.js](https://nodejs.org/) installed locally
3. [Vercel CLI](https://vercel.com/docs/cli) installed (`npm i -g vercel`)

## Deployment Steps

### 1. Configure Environment Variables

Before deploying, make sure to set up your environment variables in Vercel:

1. Create a `.env` file locally based on `.env.example`
2. When deploying, Vercel will ask you to set these variables

### 2. Deploy Using Vercel CLI

You have two options for deployment:

#### Option 1: Use the Deployment Script

Simply run:

```bash
./deploy-to-vercel.bat
```

#### Option 2: Manual Deployment

1. Build your project:

```bash
npm run build
```

2. Deploy using Vercel CLI:

```bash
vercel
```

3. For production deployment:

```bash
vercel --prod
```

### 3. Connect to Git Repository (Recommended)

For automatic deployments:

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your project in the Vercel dashboard
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

## Troubleshooting

- **Database Connectivity**: Make sure your database is accessible from Vercel's serverless environment
- **Build Errors**: Check if there are any environment-specific code that might fail in Vercel's build environment
- **API Routes**: All API routes should work under `/api/` path

For more help, refer to [Vercel Documentation](https://vercel.com/docs)
