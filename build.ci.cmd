cd Chatdown\
call npm install
call npm test
call npm pack

cd ..\Dispatch\
call npm install
REM call npm test # No tests found for this tool
call npm pack

cd ..\Ludown\
call npm install
call npm test
call npm pack

cd ..\LUIS\
call npm install
call npm test
call npm pack

cd ..\LUISGen\
call npm install
REM call npm test # No tests found for this tool
call npm pack

cd ..\MSBot\
call npm install
REM call npm test # No tests found for this tool
call npm pack

cd ..\QnAMaker\
call npm install
call npm test
call npm pack
