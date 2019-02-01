"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require('shelljs');
var tl = require("azure-pipelines-task-lib");
var Core;
(function (Core) {
    function InstallTool(toolname) {
        var args = [
            "install",
            "--loglevel error",
            "-g",
            toolname
        ];
        if (tl.osType() == "Linux") {
            RunTool("npm", args, "sudo");
        }
        else {
            RunTool("npm", args, "");
        }
    }
    Core.InstallTool = InstallTool;
    function RunTool(tool, args, prefix) {
        var str = args.join(" ");
        if (shell.exec(prefix + " " + tool + " " + args).code == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    Core.RunTool = RunTool;
})(Core = exports.Core || (exports.Core = {}));
