@echo off
echo ===================================
echo Deploying to Vercel
echo ===================================

echo Installing Vercel CLI...
npm install -g vercel

echo Building project...
npm run build

echo Deploying to Vercel...
vercel --prod

echo ===================================
echo Deployment complete!
echo ===================================
