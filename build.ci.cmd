PUSHD Chatdown\
CALL npm install
CALL npm run test-ci
POPD

IF %ERRORLEVEL% NEQ 0 GOTO ERROR

PUSHD Dispatch\
CALL npm install
REM CALL npm test # No tests found for this tool
POPD

IF %ERRORLEVEL% NEQ 0 GOTO ERROR

PUSHD Ludown\
CALL npm install
CALL npm run test-ci
POPD

IF %ERRORLEVEL% NEQ 0 GOTO ERROR

PUSHD LUIS\
CALL npm install
CALL npm run test-ci
CALL npm pack

PUSHD LUISGen\
CALL npm install
REM CALL npm test # No tests found for this tool
POPD

IF %ERRORLEVEL% NEQ 0 GOTO ERROR

PUSHD MSBot\
CALL npm install
REM CALL npm test # No tests found for this tool
POPD

IF %ERRORLEVEL% NEQ 0 GOTO ERROR

PUSHD QnAMaker\
CALL npm install
CALL npm run test-ci
POPD

IF %ERRORLEVEL% NEQ 0 GOTO ERROR

FOR /D %%i in ("Chatdown", "Dispatch", "Ludown", "LUIS", "LUISGen", "MSBot", "QnAMaker") do (
    PUSHD %%i
    CALL npm pack
    POPD
)

EXIT /b 0

:ERROR
ECHO ERRORLEVEL %ERRORLEVEL%
EXIT /b %ERRORLEVEL%