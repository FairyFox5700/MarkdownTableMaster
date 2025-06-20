@echo off
SETLOCAL

echo ===================================================
echo    MarkdownTableMaster Environment Switcher
echo ===================================================

:MENU
echo.
echo Please select an environment:
echo [1] Development (Local PostgreSQL)
echo [2] Production (Supabase)
echo [Q] Quit
echo.

SET /P CHOICE=Enter your choice (1, 2 or Q): 
IF /I "%CHOICE%"=="1" GOTO DEVELOPMENT
IF /I "%CHOICE%"=="2" GOTO PRODUCTION
IF /I "%CHOICE%"=="Q" GOTO END
GOTO MENU

:DEVELOPMENT
echo.
echo Switching to DEVELOPMENT environment...
echo.
echo Starting Docker if not already running...
docker-compose up -d
echo.
echo Starting development server...
echo.
npm run dev
GOTO END

:PRODUCTION
echo.
echo Switching to PRODUCTION environment...
echo.
echo Checking Supabase credentials...
findstr "SUPABASE_URL" .env > nul
IF %ERRORLEVEL% NEQ 0 (
  echo.
  echo ERROR: Supabase configuration not found in .env file!
  echo Please update your .env file with proper Supabase credentials.
  echo.
  GOTO END
)
echo.
echo Starting production server...
echo.
set NODE_ENV=production
npm run dev
GOTO END

:END
echo.
echo ===================================================
echo                     Goodbye!
echo ===================================================
ENDLOCAL
