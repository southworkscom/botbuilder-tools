"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shell = require('shelljs');
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
            Run("npm", args, "sudo");
        }
        else {
            Run("npm", args, "");
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
})(Tool = exports.Tool || (exports.Tool = {}));
