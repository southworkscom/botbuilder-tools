"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require('shelljs');
var execSh = require("exec-sh");
var tl = require("azure-pipelines-task-lib");
var Tool;
(function (Tool) {
    function Install(toolname) {
        if (isInstalled(toolname)) {
            return false;
        }
        var args = [
            "install",
            "--loglevel error",
            "-g",
            GetPublicToolName(toolname),
        ];
        var prefix = tl.osType() == "Linux" ? "sudo" : "";
        return Run("npm", args, prefix);
    }
    Tool.Install = Install;
    function Run(tool, args, prefix) {
        var command = "" + prefix + tool + " " + args.join(" ");
        shell.echo(command);
        return execSh(command, function (err) {
            if (err) {
                LogError("The command: \"" + command + "\" could not be run.");
                console.log("Exit code: ", err.code);
                return false;
            }
            else {
                shell.echo("true");
                return true;
            }
        });
    }
    Tool.Run = Run;
    function LogError(message) {
        tl.setResult(tl.TaskResult.Failed, message);
    }
    function isInstalled(toolName) {
        shell.echo("Validating " + toolName + " version.");
        if (shell.exec(toolName + " --version", { silent: true }).code == 0) {
            shell.echo(toolName + " is installed.");
            return true;
        }
        else {
            shell.echo(toolName + " is not installed.");
            return false;
        }
    }
    function validateNodeJsVersion() {
        shell.echo("Validating NodeJS version.");
        var result = shell.exec("node --version");
        var version = getNumericVersion(result.stdout);
        if (version[0] < 8 || (version[0] == 8 && version[1] < 5)) {
            tl.setResult(tl.TaskResult.Failed, "Node version is outdated. Please use Node Tool Installer Task and set it to version 8.5 or higher.");
            return false;
        }
        return true;
    }
    Tool.validateNodeJsVersion = validateNodeJsVersion;
    function getNumericVersion(version) {
        version = version.replace("v", "");
        var splittedVersion = version.split(".");
        var numericVersion = [];
        splittedVersion.forEach(function (element) {
            numericVersion.push(parseInt(element));
        });
        return numericVersion;
    }
    function GetPublicToolName(toolname) {
        switch (toolname) {
            case "dispatch":
                return "botdispatch";
            case "luis":
                return "luis-apis";
            default:
                return toolname;
        }
    }
})(Tool = exports.Tool || (exports.Tool = {}));
