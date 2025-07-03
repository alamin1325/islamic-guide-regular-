@echo off
echo ========================================
echo    Islamic Guide App Deployment
echo ========================================
echo.

echo 1. Building the application...
npm run build

echo.
echo 2. Adding files to Git...
git add .

echo.
echo 3. Committing changes...
git commit -m "Auto deployment update"

echo.
echo 4. Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo    Deployment completed!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Connect your GitHub repository
echo 3. Deploy your app
echo.
pause 