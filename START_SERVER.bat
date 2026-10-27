@echo off
title GrozCalc Local Server
cd /d "%~dp0"
echo ========================================================
echo   GrozCalc - Calorie Calculator (SERVER MODE)
echo ========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Node.js detected! Starting Node.js server...
    echo URL: http://localhost:3000
    start "" "http://localhost:3000"
    node server.js
    goto :end
)

echo Starting PowerShell HTTP Server on port 8080...
echo URL: http://localhost:8080/index.html
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"

:end
pause
