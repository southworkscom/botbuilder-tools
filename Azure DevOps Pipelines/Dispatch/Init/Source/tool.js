"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require('shelljs');
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
        if (tl.osType() == "Linux") {
            var prefix = "sudo ";
        }
        else {
            var prefix = "";
        }
        if (!Run("npm", args, prefix)) {
            LogError("There was a problem installing " + toolname);
        }
    }
    Tool.Install = Install;
    function Run(tool, args, prefix) {
        var str = args.join(" ");
        shell.echo("" + prefix + tool + " " + str);
        if (shell.exec("" + prefix + tool + " " + str).code == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    Tool.Run = Run;
    function GetInitInputs() {
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
                inputs.push("--" + arg + " " + tempInput);
            }
        }
        return inputs;
    }
    Tool.GetInitInputs = GetInitInputs;
    function LogError(message) {
        tl.setResult(tl.TaskResult.Failed, message);
    }
    function isInstalled(toolName) {
        if (shell.exec(toolName + " --version", { silent: true }).code == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    function validateNodeJsVersion() {
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
