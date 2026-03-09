@echo off
echo ============================================
echo   CLEANUP OLD DATABASE FILES
echo ============================================
echo.
echo This will delete:
echo   - toyota.db (SQLite)
echo   - cars.json, news.json, promotions.json
echo   - data-contacts.json, data-quotes.json, data-test-drives.json
echo   - database-file.js, database-mongodb.js
echo   - init-db.js, database.js
echo.
echo Make sure you have:
echo   1. Successfully migrated to PostgreSQL
echo   2. Tested the application thoroughly
echo   3. Created a backup if needed
echo.
set /p confirm="Are you sure? (yes/no): "

if /i not "%confirm%"=="yes" (
    echo Cleanup cancelled.
    pause
    exit /b
)

echo.
echo Deleting files...

if exist toyota.db del /f toyota.db && echo [OK] toyota.db deleted
if exist cars.json del /f cars.json && echo [OK] cars.json deleted
if exist news.json del /f news.json && echo [OK] news.json deleted
if exist promotions.json del /f promotions.json && echo [OK] promotions.json deleted
if exist data-contacts.json del /f data-contacts.json && echo [OK] data-contacts.json deleted
if exist data-quotes.json del /f data-quotes.json && echo [OK] data-quotes.json deleted
if exist data-test-drives.json del /f data-test-drives.json && echo [OK] data-test-drives.json deleted
if exist database-file.js del /f database-file.js && echo [OK] database-file.js deleted
if exist database-mongodb.js del /f database-mongodb.js && echo [OK] database-mongodb.js deleted
if exist database.js del /f database.js && echo [OK] database.js deleted
if exist init-db.js del /f init-db.js && echo [OK] init-db.js deleted
if exist database-vercel.js del /f database-vercel.js && echo [OK] database-vercel.js deleted
if exist fix-images-field.js del /f fix-images-field.js && echo [OK] fix-images-field.js deleted

echo.
echo ============================================
echo   CLEANUP COMPLETED!
echo ============================================
echo.
echo Next steps:
echo   1. Test your application: npm start
echo   2. Verify all features work correctly
echo   3. Commit changes to git
echo.
pause
