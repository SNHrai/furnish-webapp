@echo off
echo Testing Backend Setup...
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Testing FastAPI import...
python -c "from app.main import app; print('✓ FastAPI app loaded successfully')"
if errorlevel 1 (
    echo ✗ Error loading FastAPI app
    pause
    exit /b 1
)

echo.
echo ✓ Backend setup appears to be working correctly!
echo.
echo To start the backend server manually, run:
echo   venv\Scripts\activate.bat
echo   uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
echo.
echo Press any key to exit...
pause > nul
