"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tool_1 = require("./tool");
var tl = require("azure-pipelines-task-lib");
Run();
function Run() {
    var inputs = ["init"];
inputs = inputs.concat(GetInitInputs());
    inputs = inputs.concat(GetInitInputs());
    if (tool_1.Tool.validateNodeJsVersion()) {
        if (tool_1.Tool.Install("dispatch")) {
    console.log("echo");
            tool_1.Tool.Run("dispatch", inputs, "");
        }
    }
    return true;
}
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
        "LuisSubscriptme queda ionRegion",
        "UseAllTrainingData",
        "DontReviseUtterance",
        "PublishToStaging"
    ];
    var inputs = [];
    args.forEach(function (arg) {
        var input = tl.getInput(arg);
        if (input != null) {
            inputs.push("--" + arg + " " + input);
        }
    });
    return inputs;
}
