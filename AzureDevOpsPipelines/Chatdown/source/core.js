"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const tl = require("azure-pipelines-task-lib");
const path = require("path");
class Core {
    constructor() {
        // This will contain either 'sudo' or nothing depending on the OS
        this.prefix = "";
        this.getPrefix();
        // TODO: Add validation to see if it is already installed
        console.log("Downloading and installing Chatdown...");
        this.run(`npm install -g chatdown`);
    }
    transcribe(inputFile, exportFile) {
        this.run(`chatdown ${inputFile} > ${exportFile} ${this.getStaticDate()}`);
    }
    getInputFileName() {
        return tl.getInput('filename');
    }
    getExportDirectory() {
        return tl.getInput('exportdirectory');
    }
    getOutputFileName() {
        var fileName = `${path.basename(this.getInputFileName(), '.chat')}.transcript`;
        var directory = this.getExportDirectory();
        return path.join(directory, fileName);
    }
    getStaticDate() {
        var input = tl.getInput('static');
        return input != null && input == "true" ? '--static' : '';
    }
    getCWD(cwd) {
        return { cwd: tl.getInput(cwd) };
    }
    GetParameters(parameters) {
        var inputs = [];
        for (var key in parameters) {
            var input = tl.getInput(key);
            if (input != null) {
                inputs.push(`--${key} ${input}`);
            }
        }
        return inputs.join(' ');
    }
    run(command, options) {
        var command = `${this.prefix} ${command}`;
        console.log(`Running command: ${command}.`);
        try {
            console.log(child_process_1.execSync(command, options).toString());
        }
        catch (error) {
            this.LogError(`A problem ocurred: ${error.message}`);
        }
    }
    LogError(message) {
        tl.setResult(tl.TaskResult.Failed, message);
    }
    getPrefix() {
        this.prefix = tl.osType() == "Linux" ? "sudo" : "";
    }
}
exports.Core = Core;
