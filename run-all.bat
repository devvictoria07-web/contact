@echo off
echo =======================================================
echo  Directorio Comercial - Paginas Amarillas Nicaragua
echo =======================================================
echo Iniciando Backend Laravel 13 (Puerto 8000)...
start "Backend Laravel API" cmd /k "cd /d %~dp0backend && php artisan serve --port=8000"
echo Iniciando Frontend React 19 (Puerto 3000)...
start "Frontend React 19" cmd /k "cd /d %~dp0frontend && npm run dev -- --port 3000"
echo.
echo =======================================================
echo  Aplicacion en ejecucion:
echo  Frontend: http://localhost:3000/
echo  Backend:  http://localhost:8000/api
echo =======================================================

