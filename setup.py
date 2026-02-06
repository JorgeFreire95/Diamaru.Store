import subprocess
import sys
import os
import platform

def run_setup():
    """Ejecuta la configuración del proyecto"""
    
    print("\n" + "="*50)
    print("🎨 DIAMARU STORE - Setup Automático")
    print("="*50 + "\n")
    
    # Detectar sistema operativo
    system = platform.system()
    
    # Verificar Python
    print("✓ Verificando Python...")
    try:
        result = subprocess.run([sys.executable, "--version"], 
                              capture_output=True, text=True)
        print(f"  {result.stdout.strip()}")
    except:
        print("✗ Python no encontrado. Instálalo desde https://python.org/")
        return False
    
    # Verificar Node.js
    print("✓ Verificando Node.js...")
    try:
        result = subprocess.run(["npm", "--version"], 
                              capture_output=True, text=True)
        print(f"  npm {result.stdout.strip()}")
    except:
        print("✗ Node.js/npm no encontrado. Instálalo desde https://nodejs.org/")
        return False
    
    # Setup Backend
    print("\n📦 Configurando Backend...")
    
    backend_path = os.path.join(os.getcwd(), "backend")
    
    # Crear venv
    print("  → Creando entorno virtual...")
    venv_path = os.path.join(backend_path, "venv")
    
    try:
        subprocess.run([sys.executable, "-m", "venv", venv_path], check=True)
        print("    ✓ Entorno virtual creado")
    except:
        print("    ✗ Error al crear entorno virtual")
        return False
    
    # Determinar el comando de activación
    if system == "Windows":
        activate_cmd = os.path.join(venv_path, "Scripts", "activate.bat")
    else:
        activate_cmd = os.path.join(venv_path, "bin", "activate")
    
    # Instalar dependencias
    print("  → Instalando dependencias...")
    pip_path = os.path.join(venv_path, "Scripts", "pip") if system == "Windows" else os.path.join(venv_path, "bin", "pip")
    
    try:
        req_file = os.path.join(backend_path, "requirements.txt")
        subprocess.run([pip_path, "install", "-r", req_file], check=True)
        print("    ✓ Dependencias instaladas")
    except:
        print("    ✗ Error al instalar dependencias")
        return False
    
    # Crear .env
    print("  → Creando archivo .env...")
    env_file = os.path.join(backend_path, ".env")
    if not os.path.exists(env_file):
        env_content = """DATABASE_URL=sqlite:///./diamaru.db
API_HOST=0.0.0.0
API_PORT=8000
"""
        with open(env_file, "w") as f:
            f.write(env_content)
        print("    ✓ Archivo .env creado")
    else:
        print("    ✓ Archivo .env ya existe")
    
    # Poblar DB
    print("  → Poblando base de datos...")
    try:
        python_exe = os.path.join(venv_path, "Scripts", "python") if system == "Windows" else os.path.join(venv_path, "bin", "python")
        seed_file = os.path.join(backend_path, "seed.py")
        subprocess.run([python_exe, seed_file], check=True, cwd=backend_path)
        print("    ✓ Base de datos poblada")
    except:
        print("    ⚠ Advertencia: No se pudo ejecutar seed.py")
    
    print("✓ Backend configurado\n")
    
    # Setup Frontend
    print("⚛️  Configurando Frontend...")
    
    frontend_path = os.path.join(os.getcwd(), "frontend")
    
    # Instalar dependencias
    print("  → Instalando dependencias npm...")
    try:
        subprocess.run(["npm", "install"], cwd=frontend_path, check=True)
        print("    ✓ Dependencias instaladas")
    except:
        print("    ✗ Error al instalar dependencias")
        return False
    
    # Crear .env
    print("  → Creando archivo .env...")
    env_file = os.path.join(frontend_path, ".env")
    if not os.path.exists(env_file):
        env_content = "VITE_API_URL=http://localhost:8000\n"
        with open(env_file, "w") as f:
            f.write(env_content)
        print("    ✓ Archivo .env creado")
    else:
        print("    ✓ Archivo .env ya existe")
    
    print("✓ Frontend configurado\n")
    
    # Instrucciones finales
    print("="*50)
    print("✅ ¡Instalación completada exitosamente!")
    print("="*50 + "\n")
    
    print("Para ejecutar el proyecto:\n")
    
    print("Terminal 1 - Backend:")
    if system == "Windows":
        print("  cd backend")
        print("  venv\\Scripts\\activate")
        print("  python main.py")
    else:
        print("  cd backend")
        print("  source venv/bin/activate")
        print("  python main.py")
    
    print("\nTerminal 2 - Frontend:")
    print("  cd frontend")
    print("  npm run dev")
    
    print("\nAcceso:")
    print("  Frontend:     http://localhost:3000")
    print("  Backend:      http://localhost:8000")
    print("  API Docs:     http://localhost:8000/docs")
    
    return True


if __name__ == "__main__":
    success = run_setup()
    if not success:
        print("\n✗ Setup incompleto. Verifica los errores arriba.")
        sys.exit(1)
