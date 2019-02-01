const shell = require('shelljs');
import tl = require("azure-pipelines-task-lib");

export module Core {

    export function InstallTool(toolname: string): void {
        var args = [
            "install",
            "--loglevel error",
            "-g",
            toolname
        ];

        if (tl.osType() == "Linux") {
            RunTool("npm", args, "sudo");
        } else {
            RunTool("npm", args, "");
        }
    }

    export function RunTool(tool: string, args: string[], prefix: string): boolean{
        var str = args.join(" "); 
        if (shell.exec(`${prefix} ${tool} ${args}`).code == 0){
            return true;
        } else {
            return false;
        }
    }
}