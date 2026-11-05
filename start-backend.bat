@echo off
echo =======================================================
echo  Iniciando Backend API Laravel (Puerto 8000)
echo =======================================================
cd /d "%~dp0backend"
php artisan serve --port=8000
pause

