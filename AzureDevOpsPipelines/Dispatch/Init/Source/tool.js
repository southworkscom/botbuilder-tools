"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require('shelljs');
var execSh = require("exec-sh");
var tl = require("azure-pipelines-task-lib");
var Tool;
(function (Tool) {
    function Install(toolname) {
        if (isInstalled(toolname)) {
            return;
        }
        var args = [
            "install",
            "--loglevel error",
            "-g",
            GetPublicToolName(toolname),
        ];
        var prefix = tl.osType() == "Linux" ? "sudo" : "";
        Run("npm", args, prefix);
    }
    Tool.Install = Install;
    function Run(tool, args, prefix) {
        var command = "" + prefix + tool + " " + args.join(" ");
        execSh(command, function (err) {
            if (err) {
                LogError("The command: \"" + command + "\" could not be run.");
                console.log("Exit code: ", err.code);
            }
        });
    }
    Tool.Run = Run;
    function LogError(message) {
        tl.setResult(tl.TaskResult.Failed, message);
    }
    function isInstalled(toolName) {
        console.log("Validating " + toolName + " version.");
        if (shell.exec(toolName + " --version", { silent: true }).code == 0) {
            console.log(toolName + " is installed.");
            return true;
        }
        else {
            console.log(toolName + " is not installed.");
            return false;
        }
    }
    function validateNodeJsVersion() {
        console.log("Validating NodeJS version.");
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
