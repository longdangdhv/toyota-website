@echo off
echo ============================================
echo   BACKUP OLD DATABASE FILES
echo ============================================
echo.

set backup_dir=backup-%date:~-4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set backup_dir=%backup_dir: =0%

echo Creating backup directory: %backup_dir%
mkdir %backup_dir%

echo.
echo Backing up files...

if exist toyota.db copy toyota.db %backup_dir%\ && echo [OK] toyota.db backed up
if exist cars.json copy cars.json %backup_dir%\ && echo [OK] cars.json backed up
if exist news.json copy news.json %backup_dir%\ && echo [OK] news.json backed up
if exist promotions.json copy promotions.json %backup_dir%\ && echo [OK] promotions.json backed up
if exist data-contacts.json copy data-contacts.json %backup_dir%\ && echo [OK] data-contacts.json backed up
if exist data-quotes.json copy data-quotes.json %backup_dir%\ && echo [OK] data-quotes.json backed up
if exist data-test-drives.json copy data-test-drives.json %backup_dir%\ && echo [OK] data-test-drives.json backed up
if exist database-file.js copy database-file.js %backup_dir%\ && echo [OK] database-file.js backed up
if exist database-mongodb.js copy database-mongodb.js %backup_dir%\ && echo [OK] database-mongodb.js backed up

echo.
echo ============================================
echo   BACKUP COMPLETED!
echo ============================================
echo.
echo Backup saved to: %backup_dir%
echo.
pause
