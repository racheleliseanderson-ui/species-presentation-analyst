@echo off
REM Intentionally no SETLOCAL: CLAUDE_CMD must survive back into the caller.
set "CLAUDE_CMD="
set "CLAUDE_KIND="

REM 1. Whatever the current shell already resolves.
for /f "delims=" %%P in ('where claude 2^>nul') do if not defined CLAUDE_CMD (
  set "CLAUDE_CMD=%%P"
  set "CLAUDE_KIND=PATH"
)
if defined CLAUDE_CMD exit /b 0

REM 2. Native Claude Code installer location used on Windows.
if exist "%USERPROFILE%\.local\bin\claude.exe" (
  set "CLAUDE_CMD=%USERPROFILE%\.local\bin\claude.exe"
  set "CLAUDE_KIND=native"
  exit /b 0
)

REM 3. WinGet link location.
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\claude.exe" (
  set "CLAUDE_CMD=%LOCALAPPDATA%\Microsoft\WinGet\Links\claude.exe"
  set "CLAUDE_KIND=winget"
  exit /b 0
)

REM 4. Legacy/npm global install. The caller uses CALL so a .cmd shim returns safely.
if exist "%APPDATA%\npm\claude.cmd" (
  set "CLAUDE_CMD=%APPDATA%\npm\claude.cmd"
  set "CLAUDE_KIND=npm"
  exit /b 0
)
if exist "%APPDATA%\npm\claude.exe" (
  set "CLAUDE_CMD=%APPDATA%\npm\claude.exe"
  set "CLAUDE_KIND=npm"
  exit /b 0
)

REM 5. PowerShell may know a command that CMD's WHERE cannot see.
for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "$c=Get-Command claude -ErrorAction SilentlyContinue; if($c){$c.Source}" 2^>nul`) do if not defined CLAUDE_CMD (
  set "CLAUDE_CMD=%%P"
  set "CLAUDE_KIND=PowerShell"
)
if defined CLAUDE_CMD exit /b 0

exit /b 1
