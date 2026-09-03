@echo off
setlocal enabledelayedexpansion
title Species Analyst - Add Species
cd /d "%~dp0"
color 0F
mode con: cols=100 lines=45

echo.
echo  ================================================================
echo    ADD SPECIES
echo  ================================================================
echo.
echo   You list the fish you want in data\species-targets.json.
echo   This checks whether each one is already in the catalogue under
echo   a name you did not think to type, works out which existing
echo   records it will be confused with in the field, and writes a
echo   research brief for each genuinely new one.
echo.
echo   It does NOT write a species record. It cannot. A record here is
echo   a reviewed biological claim built from agency and peer-reviewed
echo   sources, and a script that invented one would be the exact
echo   failure this whole application exists to avoid.
echo.
echo   What it gives you is everything up to where judgment starts.
echo   Hand the brief to Claude and the research happens there.
echo.
echo   Under a minute.
echo.
echo  ----------------------------------------------------------------
echo.
pause
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo   ^>^> STOPPED. Node.js is not installed on this computer.
  echo.
  echo      Go to    https://nodejs.org
  echo      Click the big green "LTS" button, install it,
  echo      then RESTART this file.
  echo.
  pause
  exit /b 1
)

if not exist "data\species-targets.json" (
  echo.
  echo   ^>^> STOPPED. data\species-targets.json is missing.
  echo      That file is the list of fish to look for.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\.package-lock.json" (
  echo  Installing the tools the project needs. First time only.
  call npm install --no-audit --no-fund
  echo.
)

echo  Reading your list...
echo  ----------------------------------------------------------------
call npm run species:brief
echo  ----------------------------------------------------------------
echo.
echo  ================================================================
echo   Nothing in the catalogue was changed.
echo.
echo   The briefs are in the reports folder, named brief-*.md.
echo   Open one, read the lookalikes, then hand it to Claude.
echo  ================================================================
echo.
pause
endlocal
