import { Tool } from "./tool";
import tl = require("azure-pipelines-task-lib");

var inputs = ["init"];
inputs = inputs.concat(GetInitInputs());
if (Tool.validateNodeJsVersion()) {
    Tool.Install("dispatch");
    console.log("echo");
    Tool.Run("dispatch", inputs, "");
}

function GetInitInputs(): string[] {
    var args: string[] = [
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

    var inputs: string[] = [];
    args.forEach(function (arg) {
        var input = tl.getInput(arg);
        if (input != null) {
            inputs.push(`--${arg} ${input}`);
        }
    });

    return inputs;
}