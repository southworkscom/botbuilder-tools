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

    function LogError(message: string): void {
        tl.setResult(tl.TaskResult.Failed, message);
    }
}