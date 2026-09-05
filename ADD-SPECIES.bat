@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Species Analyst - Add Researched Species
cd /d "%~dp0"
color 0F
mode con: cols=108 lines=48

if not defined SPECIES_BATCH_SIZE set "SPECIES_BATCH_SIZE=3"

echo.
echo  ================================================================================
echo    ADD SPECIES - RESEARCH, BUILD, VALIDATE, SAVE
echo  ================================================================================
echo.
echo   This researches up to !SPECIES_BATCH_SIZE! genuinely new fish, writes the
 echo   catalogue record plus all four overlays, validates the work, reseeds when
 echo   DATABASE_URL is configured, and saves only after checks pass.
echo.
echo  --------------------------------------------------------------------------------
echo.
pause

echo.
echo  [1/9] Preflight...
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

if not exist "data\species-targets.json" goto :no_targets
if not exist "prompts\species-new-research.md" goto :missing_protocol

set "DIRTY_KNOWLEDGE="
for /f "delims=" %%G in ('git status --porcelain -- data/dossiers src/lib/knowledge 2^>nul') do set "DIRTY_KNOWLEDGE=1"
if defined DIRTY_KNOWLEDGE goto :dirty_knowledge

echo        Node, Git and Claude Code are ready.
echo.

echo  [2/9] Installing project packages if needed...
if not exist "node_modules\.package-lock.json" (
  call npm install --no-audit --no-fund
  if errorlevel 1 goto :install_failed
) else (
  echo        Already installed - skipping.
)
echo.

echo  [3/9] Building new-species research briefs...
for /f "delims=" %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "RUNSTAMP=%%I"
if not defined RUNSTAMP set "RUNSTAMP=%RANDOM%-%RANDOM%"
set "RUNDIR=reports\runs\new-!RUNSTAMP!"
call npm run species:brief -- --out=!RUNDIR!
if errorlevel 1 goto :brief_failed

set /a BRIEF_COUNT=0
for /f "delims=" %%F in ('dir /b /a-d "!RUNDIR!\brief-*.md" 2^>nul') do set /a BRIEF_COUNT+=1
if !BRIEF_COUNT! EQU 0 goto :nothing_new
echo        !BRIEF_COUNT! genuinely new target(s) found; researching up to !SPECIES_BATCH_SIZE!.
echo.

echo  [4/9] Researching and writing species records...
set /a PROCESSED=0
for /f "delims=" %%F in ('dir /b /a-d "!RUNDIR!\brief-*.md" 2^>nul') do (
  if !PROCESSED! LSS !SPECIES_BATCH_SIZE! (
    set /a PROCESSED+=1
    echo.
    echo        [!PROCESSED!/!SPECIES_BATCH_SIZE!] %%F
    set "PROMPTFILE=%TEMP%\species-new-!RUNSTAMP!-!PROCESSED!.txt"
    copy /y "prompts\species-new-research.md" "!PROMPTFILE!" >nul
    >>"!PROMPTFILE!" echo.
    >>"!PROMPTFILE!" echo ^<research_brief^>
    type "!RUNDIR!\%%F" >>"!PROMPTFILE!"
    >>"!PROMPTFILE!" echo ^</research_brief^>
    call "!CLAUDE_CMD!" -p --permission-mode acceptEdits --max-turns 80 "Follow the protocol from stdin. Work directly in this repository. Perform fresh web research and edit the repository. Do not commit or push." < "!PROMPTFILE!"
    if errorlevel 1 goto :agent_failed
    del /q "!PROMPTFILE!" >nul 2>&1
  )
)
echo.
echo        Claude completed !PROCESSED! new-species research pass(es).
echo.

echo  [5/9] Validating dossiers and identity resolution...
call npm run validate:dossiers
if errorlevel 1 goto :validation_failed
call npm run report:duplicates
if errorlevel 1 goto :validation_failed
echo.

echo  [6/9] Type checking and running tests...
call npm run typecheck
if errorlevel 1 goto :typecheck_failed
call npm test
if errorlevel 1 goto :tests_failed
echo.

echo  [7/9] Checking citation reachability...
call npm run check:sources -- --concurrency=6
if errorlevel 1 goto :source_check_failed
echo.

echo  [8/9] Reseeding the database when configured...
call :load_database_url
if defined DATABASE_URL (
  call npm run db:seed-dossiers -- --write
  if errorlevel 1 goto :seed_failed
) else (
  echo        No DATABASE_URL in .env - live database left unchanged.
)
echo.

echo  [9/9] Saving the researched batch to GitHub...
if exist "!RUNDIR!" rmdir /s /q "!RUNDIR!"
git add data/dossiers src/lib/knowledge
if exist "reports\research-ledger" git add reports/research-ledger
git diff --cached --quiet
if not errorlevel 1 goto :nothing_to_commit

git commit -m "Add researched species batch"
if errorlevel 1 goto :commit_failed
git push
if errorlevel 1 goto :push_failed

echo.
echo  ================================================================================
echo    DONE - !PROCESSED! NEW SPECIES RESEARCH PASS(ES) COMPLETED AND PUSHED.
echo  ================================================================================
echo.
echo   Research provenance is in reports\research-ledger.
echo   Run this file again for the next batch in species-targets.json.
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
echo   but it would not start. Run that path with --version or run claude doctor.
goto :fail
:claude_login
echo.
echo   STOPPED. Claude Code is installed but not authenticated.
echo   Open PowerShell, run:  claude
echo   Complete the browser sign-in, then run this BAT again.
goto :fail
:no_targets
echo.
echo   STOPPED. data\species-targets.json is missing.
goto :fail
:missing_protocol
echo.
echo   STOPPED. prompts\species-new-research.md is missing.
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
:brief_failed
echo.
echo   STOPPED. The new-species brief generator failed.
goto :fail
:agent_failed
echo.
echo   STOPPED. Claude Code did not complete the species research pass.
echo   Nothing has been committed or pushed.
goto :fail
:validation_failed
echo.
echo   STOPPED. A dossier or identity rule failed validation. Nothing was pushed.
goto :fail
:typecheck_failed
echo.
echo   STOPPED. TypeScript validation failed. Nothing was pushed.
goto :fail
:tests_failed
echo.
echo   STOPPED. Tests failed. Nothing was pushed.
goto :fail
:source_check_failed
echo.
echo   STOPPED. Citation reachability needs attention. Nothing was pushed.
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
:nothing_new
echo.
echo  ================================================================================
echo    NOTHING NEW TO RESEARCH.
echo  ================================================================================
echo.
echo   Every target already resolves to a catalogue fish, or the target list is empty.
echo.
pause
exit /b 0
:nothing_to_commit
echo.
echo  ================================================================================
echo    RESEARCH RAN, BUT THERE IS NOTHING TO COMMIT.
echo  ================================================================================
echo.
echo   Review the research ledger and Claude output before trying again.
echo.
pause
exit /b 0
:fail
echo.
pause
exit /b 1
