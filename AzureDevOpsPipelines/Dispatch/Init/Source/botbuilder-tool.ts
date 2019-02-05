import { Tool } from "./tool";
import tl = require("azure-pipelines-task-lib");

Run();

function Run() {
    var inputs = ["init"];
    inputs = inputs.concat(GetInitInputs());
    if (Tool.validateNodeJsVersion()) {
        if (Tool.Install("dispatch")) {
            Tool.Run("dispatch", inputs, "");
        }
    }
    return true;
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
        "LuisSubscriptme queda ionRegion",
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