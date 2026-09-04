@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Species Analyst - Health Check
cd /d "%~dp0"
color 0F
mode con: cols=108 lines=48

echo.
echo  ================================================================================
echo    SPECIES ANALYST - HEALTH CHECK
echo  ================================================================================
echo.
echo   Read-only. It answers:
echo.
echo     - Which biological records are overdue or due soon?
echo     - Are names or aliases resolving to the wrong fish?
echo     - How much of the catalogue is actually reviewed versus partial?
echo     - Does every dossier still satisfy the schema and safety rules?
echo     - What should the next substantive refresh work on?
echo.
echo   It does not delete Git locks, alter records, reseed the database or push anything.
echo.
echo  --------------------------------------------------------------------------------
echo.
pause

echo.
where node >nul 2>&1
if errorlevel 1 goto :no_node
where npm >nul 2>&1
if errorlevel 1 goto :no_node

if exist ".git\index.lock" (
  echo   NOTE: .git\index.lock exists. Health check will not delete it.
  echo         If no Git process is running and the lock is genuinely stale, remove it manually.
  echo.
)

echo  [1/5] Review age and cadence
echo  --------------------------------------------------------------------------------
call npm run report:freshness
if errorlevel 1 goto :report_failed
echo.

echo  [2/5] Duplicate names, aliases and identity collisions
echo  --------------------------------------------------------------------------------
call npm run report:duplicates
if errorlevel 1 goto :report_failed
echo.

echo  [3/5] Reviewed coverage and declared gaps
echo  --------------------------------------------------------------------------------
call npm run report:coverage
if errorlevel 1 goto :report_failed
echo.

echo  [4/5] Dossier schema and safety validation
echo  --------------------------------------------------------------------------------
call npm run validate:dossiers
if errorlevel 1 goto :validation_failed
echo.

echo  [5/5] Ranked worklist for the next refresh
echo  --------------------------------------------------------------------------------
call npm run review:queue
if errorlevel 1 goto :report_failed
echo.

echo  ================================================================================
echo    HEALTH CHECK COMPLETE - NOTHING WAS CHANGED.
echo  ================================================================================
echo.
echo   Use ADD-SPECIES for genuinely new fish.
echo   Use REVIEW-AND-UPDATE for fresh biological re-research of existing fish.
echo   The newest reports\review-queue-*.md is the ranked maintenance list.
echo.
pause
exit /b 0

:no_node
echo.
echo   STOPPED. Node.js/npm are not installed or not on PATH.
goto :fail
:report_failed
echo.
echo   STOPPED. One of the read-only reports failed to run.
goto :fail
:validation_failed
echo.
echo   STOPPED. At least one dossier failed validation. Nothing was changed.
goto :fail
:fail
echo.
pause
exit /b 1
