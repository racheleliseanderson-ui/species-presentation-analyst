@echo off
setlocal enabledelayedexpansion
title Species Analyst - Review and Update
cd /d "%~dp0"
color 0F
mode con: cols=100 lines=45

echo.
echo  ================================================================
echo    SPECIES ANALYST - REVIEW AND UPDATE
echo  ================================================================
echo.
echo   This opens every source the catalogue cites - about 340
echo   agency pages and papers - and checks each one is still there.
echo.
echo   Where a page has permanently moved and stayed on the same
echo   site, the citation is pointed at the new address. That changes
echo   where a claim points. It never changes the claim.
echo.
echo   Anything that died, or moved to a different domain, is written
echo   into a worklist for a person to read. Nothing is guessed.
echo.
echo   Then it saves to GitHub and reseeds the database - but only if
echo   every test passes. If anything fails, nothing is saved.
echo.
echo   It only ever saves the dossier files and the reports. Anything
echo   else you have half-finished in this project stays untouched.
echo.
echo   Fifteen to thirty minutes, depending on how the agencies feel
echo   today. You do not have to watch. You can close this window any
echo   time; nothing breaks and running it again starts over cleanly.
echo.
echo   Leave your laptop plugged in, awake, and on the internet.
echo.
echo  ----------------------------------------------------------------
echo.
pause
echo.

REM ---------------------------------------------------------------- step 1
echo  [1/8] Checking your computer has what it needs...
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
for /f "tokens=*" %%v in ('node -v') do set NODEV=%%v
echo        Node.js !NODEV! - good.

if exist ".git\index.lock" (
  del /f /q ".git\index.lock" >nul 2>&1
  echo        Cleared a leftover Git lock file.
)
echo.

REM ---------------------------------------------------------------- step 2
echo  [2/8] Installing the tools the project needs...
echo        (first time only - this can take a few minutes)
if not exist "node_modules\.package-lock.json" (
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo   ^>^> STOPPED. The install failed.
    echo      Usually this means no internet connection.
    echo      Check your connection and run this file again.
    echo.
    pause
    exit /b 1
  )
) else (
  echo        Already installed - skipping.
)
echo.

REM ---------------------------------------------------------------- step 3
echo  [3/8] Taking a "before" reading, so there is something to compare against...
call npm run report:coverage > "BEFORE-report.txt" 2>&1
call npm run report:freshness >> "BEFORE-report.txt" 2>&1
echo        Saved to BEFORE-report.txt
echo.

REM ---------------------------------------------------------------- step 4
echo  [4/8] Opening every source the catalogue cites. THIS IS THE LONG PART.
echo.
echo        Silence means it is working. Only problems print.
echo        Safe to leave alone. Safe to close the window.
echo.
echo  ----------------------------------------------------------------
call npm run check:sources -- --fix --concurrency=6
echo  ----------------------------------------------------------------
echo.

REM ---------------------------------------------------------------- step 5
echo  [5/8] Checking every record still passes its own rules...
call npm run validate:dossiers
if errorlevel 1 (
  echo.
  echo   ^>^> STOPPED. A record failed validation.
  echo      Nothing has been saved to GitHub and the database was not
  echo      touched. Any link fixes are still here on your computer.
  echo      Send the messages above to Claude.
  echo.
  pause
  exit /b 1
)
echo.
call npm run report:duplicates
echo.

REM ---------------------------------------------------------------- step 6
echo  [6/8] Making sure nothing broke...
set REPAIRED=0

:typecheck
call npm run typecheck > "typecheck-results.txt" 2>&1
if not errorlevel 1 goto typecheck_ok

REM An error inside node_modules is a damaged package, not damaged code.
REM OneDrive syncing this folder while npm writes tens of thousands of files
REM into it leaves some of them cut off halfway, and TypeScript reports that
REM as a syntax error inside a library nobody has ever edited. Reinstalling
REM is the fix, so try it once before bothering anybody.
findstr /C:"error TS" "typecheck-results.txt" | findstr /V /C:"node_modules" >nul
if not errorlevel 1 goto typecheck_real_failure
if "%REPAIRED%"=="1" goto typecheck_repair_failed

echo.
echo        Every error is inside node_modules, so the installed packages are
echo        damaged rather than your code. Reinstalling them and trying again.
echo        This takes a few minutes.
echo.
rmdir /s /q node_modules
call npm install --no-audit --no-fund
set REPAIRED=1
echo.
goto typecheck

:typecheck_repair_failed
echo.
echo   ^>^> STOPPED. The packages are still damaged after a clean reinstall.
echo      Nothing has been saved.
echo.
echo      This project sits inside OneDrive. OneDrive rewriting the folder
echo      while npm is filling it is the usual cause. Pause OneDrive, run
echo      this file again, then resume OneDrive.
echo.
echo      Moving the project out of OneDrive fixes it for good.
echo.
pause
exit /b 1

:typecheck_real_failure
echo.
echo   ^>^> STOPPED. The type check failed in code, not in a package.
echo      Nothing has been saved to GitHub and the database was not
echo      touched. Send typecheck-results.txt to Claude.
echo.
pause
exit /b 1

:typecheck_ok
echo        Types are clean.
call npm test > "test-results.txt" 2>&1
findstr /C:"# fail 0" "test-results.txt" >nul
if errorlevel 1 (
  echo.
  echo   ^>^> STOPPED. Some tests did not pass.
  echo      Nothing has been saved to GitHub and the database was not
  echo      touched. Send test-results.txt to Claude.
  echo.
  pause
  exit /b 1
)
echo        All tests passed.
echo.

REM ---------------------------------------------------------------- step 7
echo  [7/8] Building the worklist and taking an "after" reading...
call npm run review:queue
call npm run report:coverage > "AFTER-report.txt" 2>&1
call npm run report:freshness >> "AFTER-report.txt" 2>&1
echo        Saved to AFTER-report.txt
echo.

REM ---------------------------------------------------------------- step 8
echo  [8/8] Saving.
echo.

REM The database write needs a connection string. It lives in .env, which
REM never goes to GitHub. If it is not there, the run still finishes and
REM says so rather than failing.
if exist ".env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env") do (
    if /i "%%a"=="DATABASE_URL" set "DATABASE_URL=%%b"
  )
)
if defined DATABASE_URL (
  echo        Reseeding the database from the repository...
  call npm run db:seed-dossiers -- --write
  if errorlevel 1 (
    echo.
    echo        The database write did not match. Your files are fine.
    echo        Tell Claude "the seed reported a mismatch".
    echo.
  )
) else (
  echo        No DATABASE_URL in .env, so the database was left alone.
  echo        The live site keeps serving what it already has.
)
echo.

echo        Saving to GitHub...
REM Only the files this run is allowed to have changed. Anything else you
REM have in progress in this repository stays yours and stays uncommitted.
git add data/dossiers src/lib/knowledge/identification-dossiers.ts src/lib/knowledge/behavior-dossiers.ts src/lib/knowledge/diet-dossiers.ts src/lib/knowledge/seasonal-calendar-dossiers.ts reports
git commit -m "Review pass: re-checked every source citation and rebuilt the worklist"
if errorlevel 1 (
  echo        Nothing new to save.
  goto :finish
)
git push
if errorlevel 1 (
  echo.
  echo        Saved on this computer, but the upload to GitHub failed.
  echo        That is usually a sign-in issue. Your work is safe here.
  echo        Tell Claude "the push failed" and it can sort it out.
) else (
  echo        Saved and uploaded.
)

:finish
echo.
echo  ================================================================
echo    DONE.
echo  ================================================================
echo.
echo   The worklist is the newest review-queue file in the reports
echo   folder. It lists, in order, what actually needs a person - and
echo   says so plainly when the answer is nothing.
echo.
echo   Send these to Claude and it will tell you what the run bought:
echo.
echo       BEFORE-report.txt
echo       AFTER-report.txt
echo       the newest reports\review-queue-*.md
echo  ----------------------------------------------------------------
echo.
pause
endlocal
