@echo off
chcp 65001 > nul
title DungAutomation 3D Shop - 1-Click Runner
cd /d "%~dp0"

echo ========================================================
echo   ⚡ DUNGAUTOMATION 3D ISOMETRIC STORE (R3F + DREI) ⚡
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Khong tim thay Node.js tren he thong.
    echo Vui long cai dat Node.js tai https://nodejs.org/
    pause
    exit /b 1
)

if not exist node_modules (
    echo [*] Dang cai dat thu vien React Three Fiber ^& Drei...
    call npm.cmd install
)

echo [*] Dang khoi dong Web Server (Vite Dev Server)...
start "" http://localhost:5173
call npm.cmd run dev

pause
