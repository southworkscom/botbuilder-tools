import { Tool } from "./tool";
import tl = require("azure-pipelines-task-lib");

var inputs = ["init"];
//inputs.concat(Tool.GetInitInputs());
if (Tool.validateNodeJsVersion()) {
    Tool.Install("dispatch");
}

//Tool.Run("dispatch", inputs, "");