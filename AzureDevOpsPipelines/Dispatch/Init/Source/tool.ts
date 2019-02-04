var shell = require('shelljs');
var execSh = require("exec-sh");
import tl = require("azure-pipelines-task-lib");
export module Tool {
    
    export function Install(toolname: string): void {
        if (isInstalled(toolname)) {
            return;
        }
        
        var args = [
            "install",
            "--loglevel error",
            "-g",
            GetPublicToolName(toolname),
        ];

        var prefix: string = tl.osType() == "Linux" ? "sudo" : "";
        Run("npm", args, prefix);
    }

    export function Run(tool: string, args: string[], prefix: string): void{
        var command = `${prefix}${tool} ${args.join(" ")}`;
        execSh(command, function(err: any){
            if (err) {
                LogError(`The command: "${command}" could not be run.`);
                console.log("Exit code: ", err.code);
            }
          });
    }

    function LogError(message: string): void {
        tl.setResult(tl.TaskResult.Failed, message);
    }

    function isInstalled(toolName: string): boolean{
        console.log(`Validating ${toolName} version.`);
        if (shell.exec(`${toolName} --version`, {silent:true}).code == 0){
            console.log(`${toolName} is installed.`);
            return true;
        }else{
            console.log(`${toolName} is not installed.`);
            return false;
        }
    }

    export function validateNodeJsVersion(): boolean{
        console.log(`Validating NodeJS version.`);
        var result = shell.exec(`node --version`);
        var version: number[] = getNumericVersion(result.stdout);
        if(version[0] < 8 || (version[0] == 8 && version[1] < 5)){
            tl.setResult(tl.TaskResult.Failed, 
                "Node version is outdated. Please use Node Tool Installer Task and set it to version 8.5 or higher.");
            return false;
        }
        return true;
    }
    
    function getNumericVersion(version: string): number[]{
        version = version.replace("v","")
        var splittedVersion = version.split(".");
        var numericVersion: number[] = [];
        splittedVersion.forEach(element => {
            numericVersion.push(parseInt(element));
        });
        return numericVersion;
    }

    function GetPublicToolName(toolname: string): string {
        switch(toolname) {
            case "dispatch":
                return "botdispatch";
            case "luis":
                return "luis-apis";
            default:
                return toolname;
          }
    }
}