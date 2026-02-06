#!/usr/bin/env powershell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Diamaru Store" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar Backend
Write-Host "[1/2] Iniciando Backend (Puerto 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList {
    Set-Location "c:\Users\Jorge\Escritorio\Diamaru.store\backend"
    & .\venv\Scripts\activate.ps1
    python main.py
}

# Esperar a que el backend inicie
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "[2/2] Iniciando Frontend (Puerto 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList {
    Set-Location "c:\Users\Jorge\Escritorio\Diamaru.store"
    npm run dev
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Servicios iniciados:" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  - Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "  - Admin: http://localhost:3000/admin/login" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciales:" -ForegroundColor Yellow
Write-Host "  Usuario: admin" -ForegroundColor Magenta
Write-Host "  Contraseña: admin123" -ForegroundColor Magenta
