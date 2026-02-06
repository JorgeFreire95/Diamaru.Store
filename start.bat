@echo off
echo ========================================
echo   Iniciando Diamaru Store
echo ========================================

:: Iniciar backend en una ventana separada
echo [1/2] Iniciando Backend (Puerto 8000)...
start "Backend - FastAPI" cmd /k "cd backend && .\venv\Scripts\activate.ps1 && python main.py"

:: Esperar un poco para que el backend inicie
timeout /t 3 /nobreak

:: Iniciar frontend
echo [2/2] Iniciando Frontend (Puerto 3000)...
start "Frontend - React/Vite" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servicios iniciados:
echo   - Frontend: http://localhost:3000
echo   - Backend: http://localhost:8000
echo   - Admin: http://localhost:3000/admin/login
echo ========================================
echo.
echo Usuario: admin
echo Contrasena: admin123
