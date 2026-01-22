@echo off
title QL_PhongHCM - Khoi dong Phan mem
color 0A
echo ==================================================
echo      PHAN MEM QUAN LY PHONG HO CHI MINH
echo ==================================================
echo.
echo Dang kiem tra moi truong...
cd server
if not exist node_modules (
    echo [!] Chua cai dat thu vien. Dang tu dong cai dat...
    npm install
)

echo.
echo [OK] Dang khoi dong Server tai port 3000...
echo.
echo === HUONG DAN ===
echo 1. Mo trinh duyet (Chrome/Coc Coc)
echo 2. Truy cap dia chi: http://localhost:3000
echo =================
echo.
npm start
pause
