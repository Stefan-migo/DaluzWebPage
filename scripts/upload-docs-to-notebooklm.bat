@echo off
REM Upload project documentation to NotebookLM
REM Run from project root: scripts\upload-docs-to-notebooklm.bat
REM Requires: nlm login --manual --file cookies.json --profile daluz (first time)

set PROFILE=daluz
set NOTEBOOK_NAME=DA LUZ Project

echo.
echo === DA LUZ - Upload docs to NotebookLM ===
echo.

REM Check auth
echo Checking authentication...
nlm login --check --profile %PROFILE% 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Authentication required. Run:
    echo   nlm login --manual --file cookies.json --profile %PROFILE%
    echo.
    exit /b 1
)

echo.
echo Creating notebook if needed...
for /f "delims=" %%i in ('nlm notebook list --profile %PROFILE% 2^>nul ^| findstr /i "notebooks"') do set NOTEBOOKS=%%i

REM Create notebook
nlm notebook create "%NOTEBOOK_NAME%" --profile %PROFILE% 2>nul

REM Get notebook ID (last created)
for /f "tokens=*" %%n in ('nlm notebook list --profile %PROFILE% 2^>nul ^| findstr /r "notebooks/.*"') do set NOTEBOOK_ID=%%n
if "%NOTEBOOK_ID%"=="" (
    echo Could not get notebook ID. Listing notebooks...
    nlm notebook list --profile %PROFILE%
    echo.
    echo Please run manually:
    echo   nlm source add ^<notebook-id^> --file Docs/PROJECT_OVERVIEW.md --profile %PROFILE% --wait
    exit /b 1
)

echo.
echo Adding PROJECT_OVERVIEW.md...
nlm source add %NOTEBOOK_ID% --file Docs/PROJECT_OVERVIEW.md --profile %PROFILE% --wait --title "Project Overview"

echo.
echo Done! Open NotebookLM to query your documentation.
echo.
