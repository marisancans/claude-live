@echo off
setlocal
set "BIN=%~dp0claude-live-windows-x86_64.exe"
if not exist "%BIN%" exit /b 0
"%BIN%" hook 2>nul
exit /b 0
