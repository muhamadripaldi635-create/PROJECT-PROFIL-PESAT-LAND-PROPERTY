@echo off
title Pesat Land Property - Server Launcher
echo ===================================================
echo   Pesat Land Property - Starting Services...
echo ===================================================

:: Check if MySQL is already running on port 3306
netstat -ano | findstr :3306 >nul
if %errorlevel% equ 0 (
    echo [MySQL] Service is already running.
) else (
    echo [MySQL] Starting MySQL from XAMPP...
    start "" /B "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 3 >nul
)

:: Check if PHP Server is already running on port 8000
netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo [PHP] Server is already running on port 8000.
) else (
    echo [PHP] Starting PHP built-in web server on port 8000...
    start "" /B php -S localhost:8000
    timeout /t 2 >nul
)

echo [Browser] Opening web application...
start http://localhost:8000/

echo ===================================================
echo   Services are running! Keep this window open.
echo   To stop the servers, close this window.
echo ===================================================
pause
