@echo off
echo ===================================
echo   PES MATCHES - Quick GitHub Push
echo ===================================
git add .
set /p commit_msg="Enter commit message (or press ENTER for 'Update site'): "
if "%commit_msg%"=="" set commit_msg=Update site
git commit -m "%commit_msg%"
git push origin main
echo ===================================
echo   Successfully pushed to GitHub!
echo ===================================
pause
