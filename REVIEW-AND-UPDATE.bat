@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Species Analyst - Substantive Review and Update
cd /d "%~dp0"
color 0F
mode con: cols=108 lines=50

if not defined SPECIES_REFRESH_BATCH_SIZE set "SPECIES_REFRESH_BATCH_SIZE=3"

echo.
echo  ================================================================================
echo    REVIEW AND UPDATE - REAL BIOLOGICAL REFRESH
echo  ================================================================================
echo.
echo   This checks existing citations, then performs fresh biological research on
 echo   up to !SPECIES_REFRESH_BATCH_SIZE! overdue, due-soon, partial or high-gap species.
echo.
echo  --------------------------------------------------------------------------------
echo.
pause

echo.
echo  [1/10] Preflight...
where node >nul 2>&1
if errorlevel 1 goto :no_node
where npm >nul 2>&1
if errorlevel 1 goto :no_node
where git >nul 2>&1
if errorlevel 1 goto :no_git

if not exist "scripts\resolve-claude.cmd" goto :missing_resolver
call "scripts\resolve-claude.cmd"
if errorlevel 1 goto :no_claude

echo        Claude Code found: !CLAUDE_CMD!
call "!CLAUDE_CMD!" --version
if errorlevel 1 goto :claude_broken
call "!CLAUDE_CMD!" auth status >nul 2>&1
if errorlevel 1 goto :claude_login

if not exist "prompts\species-refresh-research.md" goto :missing_protocol
if not exist "scripts\refresh-brief.mjs" goto :missing_refresh_script

set "DIRTY_KNOWLEDGE="
for /f "delims=" %%G in ('git status --porcelain -- data/dossiers src/lib/knowledge 2^>nul') do set "DIRTY_KNOWLEDGE=1"
if defined DIRTY_KNOWLEDGE goto :dirty_knowledge

echo        Node, Git and Claude Code are ready.
echo.

echo  [2/10] Installing project packages if needed...
if not exist "node_modules\.package-lock.json" (
  call npm install --no-audit --no-fund
  if errorlevel 1 goto :install_failed
) else (
  echo        Already installed - skipping.
)
echo.

echo  [3/10] Taking a before reading...
call npm run report:coverage > "BEFORE-report.txt" 2>&1
call npm run report:freshness >> "BEFORE-report.txt" 2>&1
call npm run report:duplicates >> "BEFORE-report.txt" 2>&1
echo        Saved BEFORE-report.txt
echo.

echo  [4/10] Checking existing citations and repairing safe same-domain moves...
call npm run check:sources -- --fix --concurrency=6
if errorlevel 1 goto :source_check_failed
echo.

echo  [5/10] Ranking species for substantive biological review...
for /f "delims=" %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "RUNSTAMP=%%I"
if not defined RUNSTAMP set "RUNSTAMP=%RANDOM%-%RANDOM%"
set "RUNDIR=reports\runs\refresh-!RUNSTAMP!"
node --experimental-strip-types scripts\refresh-brief.mjs --limit=!SPECIES_REFRESH_BATCH_SIZE! --out=!RUNDIR!
if errorlevel 1 goto :brief_failed

set /a BRIEF_COUNT=0
for /f "delims=" %%F in ('dir /b /a-d "!RUNDIR!\refresh-*.md" 2^>nul') do set /a BRIEF_COUNT+=1
echo        !BRIEF_COUNT! species selected for fresh research.
echo.

echo  [6/10] Performing substantive refresh research...
set /a PROCESSED=0
for /f "delims=" %%F in ('dir /b /a-d "!RUNDIR!\refresh-*.md" 2^>nul') do (
  set /a PROCESSED+=1
  echo.
  echo        [!PROCESSED!/!BRIEF_COUNT!] %%F
  set "PROMPTFILE=%TEMP%\species-refresh-!RUNSTAMP!-!PROCESSED!.txt"
  copy /y "prompts\species-refresh-research.md" "!PROMPTFILE!" >nul
  >>"!PROMPTFILE!" echo.
  >>"!PROMPTFILE!" echo ^<refresh_brief^>
  type "!RUNDIR!\%%F" >>"!PROMPTFILE!"
  >>"!PROMPTFILE!" echo ^</refresh_brief^>
  call "!CLAUDE_CMD!" -p --permission-mode acceptEdits --max-turns 80 "Follow the refresh protocol from stdin. Work directly in this repository. Perform fresh web research and edit the existing species record and dossiers. Do not commit or push." < "!PROMPTFILE!"
  if errorlevel 1 goto :agent_failed
  del /q "!PROMPTFILE!" >nul 2>&1
)
if !BRIEF_COUNT! EQU 0 echo        No species required substantive refresh today.
echo.

echo  [7/10] Validating dossiers, identities, types and tests...
call npm run validate:dossiers
if errorlevel 1 goto :validation_failed
call npm run report:duplicates
if errorlevel 1 goto :validation_failed
call npm run typecheck
if errorlevel 1 goto :typecheck_failed
call npm test
if errorlevel 1 goto :tests_failed
echo.

echo  [8/10] Rechecking citations and rebuilding reports...
call npm run check:sources -- --concurrency=6
if errorlevel 1 goto :source_check_failed
call npm run review:queue
call npm run report:coverage > "AFTER-report.txt" 2>&1
call npm run report:freshness >> "AFTER-report.txt" 2>&1
call npm run report:duplicates >> "AFTER-report.txt" 2>&1
echo        Saved AFTER-report.txt and rebuilt the review queue.
echo.

echo  [9/10] Reseeding the database when configured...
call :load_database_url
if defined DATABASE_URL (
  call npm run db:seed-dossiers -- --write
  if errorlevel 1 goto :seed_failed
) else (
  echo        No DATABASE_URL in .env - live database left unchanged.
)
echo.

echo  [10/10] Saving reviewed work to GitHub...
if exist "!RUNDIR!" rmdir /s /q "!RUNDIR!"
git add data/dossiers src/lib/knowledge reports "BEFORE-report.txt" "AFTER-report.txt"
git diff --cached --quiet
if not errorlevel 1 goto :nothing_to_commit

git commit -m "Refresh species evidence and source review"
if errorlevel 1 goto :commit_failed
git push
if errorlevel 1 goto :push_failed

echo.
echo  ================================================================================
echo    DONE - SOURCE HEALTH CHECKED AND !PROCESSED! SPECIES SUBSTANTIVELY REFRESHED.
echo  ================================================================================
echo.
echo   Compare BEFORE-report.txt and AFTER-report.txt.
echo   Research provenance is in reports\research-ledger.
echo.
pause
exit /b 0

:load_database_url
if exist ".env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env") do (
    if /i "%%a"=="DATABASE_URL" set "DATABASE_URL=%%b"
  )
)
exit /b 0

:no_node
echo.
echo   STOPPED. Node.js/npm are not installed or not on PATH.
goto :fail
:no_git
echo.
echo   STOPPED. Git is not installed or not on PATH.
goto :fail
:missing_resolver
echo.
echo   STOPPED. scripts\resolve-claude.cmd is missing. Run git pull origin main.
goto :fail
:no_claude
echo.
echo   STOPPED. Claude Code could not be found.
echo.
echo   The runner checked PATH, %%USERPROFILE%%\.local\bin,
echo   WinGet links, npm global commands, and PowerShell command discovery.
echo.
echo   Run these in PowerShell and send the output if this still happens:
echo      claude --version
echo      claude doctor
goto :fail
:claude_broken
echo.
echo   STOPPED. Claude Code was found at:
echo      !CLAUDE_CMD!
echo   but it would not start. Run claude doctor in PowerShell.
goto :fail
:claude_login
echo.
echo   STOPPED. Claude Code is installed but not authenticated.
echo   Open PowerShell, run:  claude
echo   Complete the browser sign-in, then run this BAT again.
goto :fail
:missing_protocol
echo.
echo   STOPPED. prompts\species-refresh-research.md is missing.
goto :fail
:missing_refresh_script
echo.
echo   STOPPED. scripts\refresh-brief.mjs is missing.
goto :fail
:dirty_knowledge
echo.
echo   STOPPED. There are unfinished changes under data\dossiers or src\lib\knowledge.
echo   Commit or stash those first so unrelated biological edits are not bundled.
goto :fail
:install_failed
echo.
echo   STOPPED. npm install failed.
goto :fail
:source_check_failed
echo.
echo   STOPPED. Source checking reported a failure. Nothing was pushed.
goto :fail
:brief_failed
echo.
echo   STOPPED. The refresh worklist could not be built.
goto :fail
:agent_failed
echo.
echo   STOPPED. Claude Code did not complete the refresh pass. Nothing was pushed.
goto :fail
:validation_failed
echo.
echo   STOPPED. Dossier or identity validation failed. Nothing was pushed.
goto :fail
:typecheck_failed
echo.
echo   STOPPED. Type checking failed. Nothing was pushed.
goto :fail
:tests_failed
echo.
echo   STOPPED. Tests failed. Nothing was pushed.
goto :fail
:seed_failed
echo.
echo   STOPPED. Database seed failed. Nothing was pushed.
goto :fail
:commit_failed
echo.
echo   STOPPED. Git commit failed. Changes remain local.
goto :fail
:push_failed
echo.
echo   The commit is safe on this computer, but git push failed.
goto :fail
:nothing_to_commit
echo.
echo  ================================================================================
echo    DONE - NOTHING NEEDED SAVING.
echo  ================================================================================
echo.
echo   Source health and refresh ranking completed, but no repository data changed.
echo.
pause
exit /b 0
:fail
echo.
pause
exit /b 1
