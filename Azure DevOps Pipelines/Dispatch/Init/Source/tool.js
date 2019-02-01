"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require("shelljs");
var tl = require("azure-pipelines-task-lib");
var Tool;
(function (Tool) {
    function Install(toolname) {
        var args = [
            "install",
            "--loglevel error",
            "-g",
            toolname
        ];
        if (tl.osType() == "Linux") {
            var prefix = "sudo";
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
        if (shell.exec(prefix + " " + tool + " " + args).code == 0) {
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
        var inputs = [];
        for (var arg in args) {
            var tempInput = tl.getInput(arg);
            if (tempInput != null) {
                inputs.push(arg);
            }
        }
        return inputs;
    }
    Tool.GetInitInputs = GetInitInputs;
    function LogError(message) {
        tl.setResult(tl.TaskResult.Failed, message);
    }
})(Tool = exports.Tool || (exports.Tool = {}));
