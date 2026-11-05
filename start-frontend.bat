@echo off
echo =======================================================
echo  Iniciando Frontend React 19 + TypeScript + Vite (Puerto 3000)
echo =======================================================
cd /d "%~dp0frontend"
npm run dev -- --port 3000
pause

