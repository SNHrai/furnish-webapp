@echo off
echo ===========================================
echo    Furnish WebApp Backend Setup Script
echo ===========================================

echo.
echo Checking Python version...
python --version
echo.

echo Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    echo Please ensure Python 3.8+ is installed
    pause
    exit /b 1
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Please check requirements.txt and try again
    pause
    exit /b 1
)

echo.
echo Setup complete!
echo.
echo To start the backend server, run:
echo   venv\Scripts\activate.bat
echo   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
echo.
pause
