@echo off
setlocal

cd /d "%~dp0"

set "DOCKER_EXE=C:\Program Files\Docker\Docker\resources\bin\docker.exe"

if not exist "%DOCKER_EXE%" (
  echo [ERROR] docker.exe not found.
  echo Expected path:
  echo %DOCKER_EXE%
  echo.
  echo Open Docker Desktop first, then try again.
  pause
  exit /b 1
)

echo [1/3] Checking Docker Desktop...
"%DOCKER_EXE%" version >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Docker Desktop is not ready.
  echo.
  echo Please do this:
  echo 1. Open Docker Desktop
  echo 2. Wait until it is fully started
  echo 3. Double-click this file again
  pause
  exit /b 1
)

echo [2/3] Copying frontend files into container...
"%DOCKER_EXE%" cp "%cd%\frontend\." health_frontend:/usr/share/nginx/html/
if errorlevel 1 (
  echo [ERROR] Copy failed.
  echo.
  echo Make sure container name is health_frontend
  echo and the container is running.
  pause
  exit /b 1
)

echo [3/3] Restarting container...
"%DOCKER_EXE%" restart health_frontend
if errorlevel 1 (
  echo [ERROR] Restart failed.
  pause
  exit /b 1
)

echo.
echo [DONE] Frontend sync completed.
echo Refresh:
echo http://localhost:8080/
echo.
pause
