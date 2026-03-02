@echo off
echo Creating views folder...
if not exist views mkdir views

echo Moving EJS files to views folder...
move index.ejs views\ 2>nul
move products.ejs views\ 2>nul
move product-detail.ejs views\ 2>nul
move test-drive.ejs views\ 2>nul
move installment.ejs views\ 2>nul
move news.ejs views\ 2>nul
move news-detail.ejs views\ 2>nul
move promotions.ejs views\ 2>nul
move contact.ejs views\ 2>nul

echo Done! All EJS files moved to views folder.
echo.
echo Next steps:
echo 1. git add .
echo 2. git commit -m "Fix: Move EJS to views folder"
echo 3. git push
echo.
pause
