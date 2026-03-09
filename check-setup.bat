@echo off
echo ============================================
echo   TOYOTA OTO - POSTGRESQL SETUP CHECK
echo ============================================
echo.

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    node --version
    echo [OK] Node.js installed
) else (
    echo [ERROR] Node.js not found. Install from: https://nodejs.org/
    goto :end
)

echo.
echo [2/5] Checking npm packages...
if exist node_modules\pg (
    echo [OK] pg package installed
) else (
    echo [WARNING] pg package not found
    echo [ACTION] Run: npm install
)

echo.
echo [3/5] Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% equ 0 (
    psql --version
    echo [OK] PostgreSQL installed
) else (
    echo [WARNING] PostgreSQL not found
    echo [OPTIONS]
    echo   1. Docker: docker run --name toyota-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
    echo   2. Download: https://www.postgresql.org/download/
    echo   3. Use cloud: Vercel Postgres, Supabase, Railway
)

echo.
echo [4/5] Checking database connection...
psql -U postgres -d toyota -c "SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Database 'toyota' accessible
) else (
    echo [WARNING] Database 'toyota' not found
    echo [ACTION] Create database:
    echo   psql -U postgres
    echo   CREATE DATABASE toyota;
    echo   \q
)

echo.
echo [5/5] Checking migration status...
if exist migrate-to-postgresql.js (
    echo [OK] Migration script found
    echo [READY] Run: npm run migrate
) else (
    echo [ERROR] Migration script not found
)

echo.
echo ============================================
echo   NEXT STEPS
echo ============================================
echo.
echo 1. If PostgreSQL not installed:
echo    - Install via Docker OR download installer
echo.
echo 2. If database not created:
echo    - Run: psql -U postgres
echo    - Run: CREATE DATABASE toyota;
echo.
echo 3. If packages not installed:
echo    - Run: npm install
echo.
echo 4. Run migration:
echo    - Run: npm run migrate
echo.
echo 5. Start server:
echo    - Run: npm start
echo.

:end
pause
