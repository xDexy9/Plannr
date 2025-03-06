@echo off
echo Starting Plannr Development Server...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Navigate to the project directory
cd /d "%~dp0"

:: Check if node_modules exists
if not exist node_modules\ (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    npm install
)

:: Start the development server
echo Starting the server...
echo The app will open in your default browser...
echo Press Ctrl+C to stop the server
echo.
npm start

pause 