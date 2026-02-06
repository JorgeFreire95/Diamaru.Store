@echo off
REM Script de configuración para Windows

echo.
echo 🎨 Instalación de Diamaru Store
echo ================================

REM Instalación del Backend
echo.
echo 📦 Configurando Backend...
cd backend

REM Crear entorno virtual
python -m venv venv

REM Activar entorno
call venv\Scripts\activate.bat

REM Instalar dependencias
pip install -r requirements.txt

REM Crear archivo .env
if not exist .env (
    copy .env.example .env
    echo ✓ Archivo .env creado
)

REM Poblar base de datos
echo 📊 Poblando base de datos...
python seed.py

echo ✓ Backend listo

REM Instalación del Frontend
echo.
echo ⚛️  Configurando Frontend...
cd ..\frontend

REM Instalar dependencias
call npm install

REM Crear archivo .env
if not exist .env (
    copy .env.example .env
    echo ✓ Archivo .env creado
)

echo ✓ Frontend listo

echo.
echo ================================
echo ✅ ¡Instalación completada!
echo.
echo Para ejecutar el proyecto:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate.bat
echo   python main.py
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo El proyecto estará disponible en http://localhost:3000
echo API disponible en http://localhost:8000
echo Documentación de API en http://localhost:8000/docs
echo.
pause
