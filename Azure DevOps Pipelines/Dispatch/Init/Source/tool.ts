var shell = require('shelljs');
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

        if (tl.osType() == "Linux") {
            var prefix = "sudo ";
        } else {
            var prefix = "";
        }

        if (!Run("npm", args, prefix)) {
            LogError(`There was a problem installing ${toolname}`);
        }
    }

    export function Run(tool: string, args: string[], prefix: string): boolean{
        var str = args.join(" ");
        shell.echo(`${prefix}${tool} ${str}`)
        if (shell.exec(`${prefix}${tool} ${str}`).code == 0){
            return true;
        } else {
            return false;
        }
    }
    
    export function GetInitInputs(): string[] {
        var args = [
            "Name",
            "LuisAuthoringKey",
            "LuisAuthoringRegion",
            "dataFolder",
            "bot",
            "secret",
            "culture",
            "hierarchical",
            "LuisSubscriptionKey",
            "LuisSubscriptionRegion",
            "UseAllTrainingData",
            "DontReviseUtterance",
            "PublishToStaging"
        ];

        /*
        var LANGUAGE = {
            Name: "-n",
            LuisAuthoringKey: "--luisAuthoringKey",
            LuisAuthoringRegion: "--luisAuthoringRegion",
            dataFolder:,
            bot:,
            secret:,
            culture:,
            hierarchical:,
            LuisSubscriptionKey:,
            LuisSubscriptionRegion:,
            UseAllTrainingData:,
            DontReviseUtterance:,
            PublishToStaging
        }
        */

        var inputs = [];
        for (var arg in args) {
            var tempInput = tl.getInput(arg);
            if (tempInput != null) {
                inputs.push(`--${arg} ${tempInput}`);
            }
        }

        return inputs;
    }

    function LogError(message: string): void {
        tl.setResult(tl.TaskResult.Failed, message);
    }

    function isInstalled(toolName: string): boolean{
        if (shell.exec(`${toolName} --version`, {silent:true}).code == 0){
            return true;
        }else{
            return false;
        }
    }

    export function validateNodeJsVersion(): boolean{
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