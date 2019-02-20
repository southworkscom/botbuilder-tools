"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib");
const child_process_1 = require("child_process");
var path = require('path');
var fs = require('fs');
init();
function init() {
    // Instal TFX
    runCommand('npm install tfx-cli -g');
    // Get the working dir and glob file name from the selected file
    console.log('getting the inputs');
    var glob = tl.getInput('manifest-globs');
    console.log(glob);
    var globFilename = path.basename(glob);
    console.log(globFilename);
    var workingDir = path.dirname(glob);
    console.log(workingDir);
    // Get Versioning style, and version if manual
    var versioning = tl.getInput('versioning');
    if (versioning == 'manual') {
        var versionNumber = tl.getInput('versioning');
    }
    var revVersion = versioning == 'automatic' ? '--rev-version' : '';
    var shareWith = tl.getInput('share-with');
    var token = tl.getInput('token');
    // Deploy task to Marketplace
    runCommand(`tfx extension publish ` +
        `--manifest-globs ${globFilename} ` +
        `--share-with ${shareWith} ` +
        `--token ${token} ` +
        revVersion, workingDir);
}
function IncreaseHotfixVersion(extension) {
    var version = extension.version.split(`.`);
    var hotfix = parseInt(version[2]);
    hotfix++;
    version[2] = hotfix;
    extension.version = version.join(`.`);
    return extension;
}
function WriteFile(extension, fileName) {
    fs.writeFileSync(`./${fileName}`, JSON.stringify(extension, null, 2), 'utf-8');
}
function LoadJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
function runCommand(command, workingDir) {
    console.log(child_process_1.execSync(command, { cwd: workingDir }).toString());
}
