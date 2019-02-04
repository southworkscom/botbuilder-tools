"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tool_1 = require("./tool");
var inputs = ["init"];
inputs = inputs.concat(tool_1.Tool.GetInitInputs());
if (tool_1.Tool.validateNodeJsVersion()) {
    tool_1.Tool.Install("dispatch");
    tool_1.Tool.Run("dispatch", inputs, "");
}
