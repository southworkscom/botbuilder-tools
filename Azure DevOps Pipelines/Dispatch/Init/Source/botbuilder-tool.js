"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tool_1 = require("./tool");
var inputs = ["init"];
//inputs.concat(Tool.GetInitInputs());
if (tool_1.Tool.validateNodeJsVersion()) {
    tool_1.Tool.Install("dispatch");
}
//Tool.Run("dispatch", inputs, "");
