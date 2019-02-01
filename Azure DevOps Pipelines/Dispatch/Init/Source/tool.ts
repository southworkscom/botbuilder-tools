const shell = require('shelljs');
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
            Run("npm", args, "sudo");
        } else {
            Run("npm", args, "");
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
}