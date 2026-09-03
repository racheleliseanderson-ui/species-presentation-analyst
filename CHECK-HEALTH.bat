@echo off
setlocal enabledelayedexpansion
title Species Analyst - Health Check
cd /d "%~dp0"
color 0F
mode con: cols=100 lines=45

echo.
echo  ================================================================
echo    HEALTH CHECK
echo  ================================================================
echo.
echo   Answers four questions in about a minute:
echo     - How old is the information?
echo     - Is anything said twice, or said about the wrong fish?
echo     - How much can the catalogue actually answer?
echo     - Does every record still pass its own rules?
echo.
echo   It only reads. It changes nothing.
echo.
echo  ----------------------------------------------------------------
echo.
pause
echo.

if exist ".git\index.lock" del /f /q ".git\index.lock" >nul 2>&1

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

REM Nothing here needs the project's packages installed. Every check below is
REM plain Node reading the repository, so this file works on a fresh clone and
REM keeps working when node_modules is missing or damaged.

echo  [1/4] How old is the information?
echo  ----------------------------------------------------------------
call npm run report:freshness
echo.

echo  [2/4] Anything said twice, or about the wrong fish?
echo  ----------------------------------------------------------------
call npm run report:duplicates
echo.

echo  [3/4] What can it answer?
echo  ----------------------------------------------------------------
call npm run report:coverage
echo.

echo  [4/4] Does every record still pass its own rules?
echo  ----------------------------------------------------------------
call npm run validate:dossiers
echo.

echo  ================================================================
echo   Nothing was changed.
echo.
echo   If records are past their review date, or a name resolves to
echo   two different fish, run REVIEW-AND-UPDATE.
echo.
echo   If a record failed validation, tell Claude what it said.
echo  ================================================================
echo.
pause
endlocal
