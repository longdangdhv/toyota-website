@echo off
echo ============================================
echo   TOYOTA OTO - POSTGRESQL QUICK SETUP
echo ============================================
echo.
echo This script will:
echo   1. Check requirements
echo   2. Install npm packages
echo   3. Create database (if not exists)
echo   4. Run migration
echo   5. Start server
echo.
pause

echo.
echo [Step 1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

echo.
echo [Step 2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)
echo [OK] Dependencies installed

echo.
echo [Step 3/5] Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL not found locally
    echo.
    echo OPTIONS:
    echo   A. Use Docker: docker run --name toyota-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
    echo   B. Download installer: https://www.postgresql.org/download/
    echo   C. Use cloud database: Vercel Postgres, Supabase, Railway
    echo.
    set /p choice="Choose option (A/B/C) or Enter to skip: "
    
    if /i "%choice%"=="A" (
        echo Running Docker container...
        docker run --name toyota-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
        timeout /t 5 /nobreak >nul
    )
)

echo.
echo [Step 4/5] Creating database...
psql -U postgres -c "CREATE DATABASE toyota" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Database created
) else (
    echo [INFO] Database might already exist or PostgreSQL not running
)

echo.
echo [Step 5/5] Running migration...
call npm run migrate
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Migration failed!
    echo.
    echo Please check:
    echo   1. PostgreSQL is running
    echo   2. Database 'toyota' exists
    echo   3. Connection settings in .env
    echo.
    echo Manual steps:
    echo   psql -U postgres
    echo   CREATE DATABASE toyota;
    echo   \q
    echo   npm run migrate
    pause
    exit /b 1
)

echo.
echo ============================================
echo   SETUP COMPLETED SUCCESSFULLY!
echo ============================================
echo.
echo Starting server...
echo.
call npm start
