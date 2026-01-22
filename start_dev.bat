@echo off
echo Dang khoi dong he thong QL_PhongHCM...

:: 1. Start Server (Backend)
start "QL_PhongHCM Server" cmd /k "cd server && npm start"

:: 2. Start Client (Frontend)
:: Using 'npm run dev' for testing
start "QL_PhongHCM Client" cmd /k "cd client && npm run dev"

echo He thong dang khoi dong...
echo Vui long cho cua so trinh duyet mo ra hoac truy cap: http://localhost:5173
pause
