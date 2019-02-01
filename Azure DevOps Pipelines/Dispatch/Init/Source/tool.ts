import shell = require('shelljs');
import tl = require("azure-pipelines-task-lib");

export module Tool {

    export function Install(toolname: string): void {
        var args = [
            "install",
            "--loglevel error",
            "-g",
            toolname
        ];

        if (tl.osType() == "Linux") {
            var prefix = "sudo";
        } else {
            var prefix = "";
        }

        if (!Run("npm", args, prefix)) {
            LogError(`There was a problem installing ${toolname}`);
        }
    }

    export function Run(tool: string, args: string[], prefix: string): boolean{
        var str = args.join(" "); 
        if (shell.exec(`${prefix} ${tool} ${args}`).code == 0){
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

        var inputs = [];
        for (var arg in args) {
            var tempInput = tl.getInput(arg);
            if (tempInput != null) {
                inputs.push(arg);
            }
        }

        return inputs;
    }

    function LogError(message: string): void {
        tl.setResult(tl.TaskResult.Failed, message);
    }
}