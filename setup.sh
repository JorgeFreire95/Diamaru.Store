#!/bin/bash

# Script de configuración e instalación de Diamaru Store

echo "🎨 Instalación de Diamaru Store"
echo "================================"

# Instalación del Backend
echo ""
echo "📦 Configurando Backend..."
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    venv\Scripts\activate
else
    source venv/bin/activate
fi

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Archivo .env creado"
fi

# Poblar base de datos
echo "📊 Poblando base de datos..."
python seed.py

echo "✓ Backend listo"

# Instalación del Frontend
echo ""
echo "⚛️  Configurando Frontend..."
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Archivo .env creado"
fi

echo "✓ Frontend listo"

echo ""
echo "================================"
echo "✅ Instalación completada!"
echo ""
echo "Para ejecutar el proyecto:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  python -m venv venv"
echo "  # Activar venv (venv\Scripts\activate en Windows)"
echo "  python main.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "El proyecto estará disponible en http://localhost:3000"
echo "API disponible en http://localhost:8000"
echo "Documentación de API en http://localhost:8000/docs"
