Write-Host "========================================" -ForegroundColor Green
Write-Host "    Islamic Guide App Deployment" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. Building the application..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "2. Adding files to Git..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "3. Committing changes..." -ForegroundColor Yellow
git commit -m "Auto deployment update"

Write-Host ""
Write-Host "4. Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    Deployment completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Connect your GitHub repository" -ForegroundColor White
Write-Host "3. Deploy your app" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue..." 