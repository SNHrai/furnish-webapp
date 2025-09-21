#!/usr/bin/env python3

import sys
import os
import subprocess

# Add the backend directory to the Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    try:
        # Start the FastAPI service
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8001",
            "--reload"
        ], cwd=backend_dir)
    except KeyboardInterrupt:
        print("\nShutting down AI Services API...")
    except Exception as e:
        print(f"Error starting AI Services API: {e}")
        sys.exit(1)