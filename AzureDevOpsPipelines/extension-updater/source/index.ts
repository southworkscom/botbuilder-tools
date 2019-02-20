import tl = require("azure-pipelines-task-lib");
import { execSync } from "child_process";
var path = require('path');
var fs = require('fs');

init();

function init(): void {
    // Instal TFX
    runCommand('npm install tfx-cli -g');

    // Get the working dir and glob file name from the selected file
    console.log('getting the inputs');
    var glob: string = tl.getInput('manifest-globs');
    console.log(glob);
    var globFilename: string = path.basename(glob);
    console.log(globFilename);
    var workingDir: string = path.dirname(glob);
    console.log(workingDir);
    
    // Get Versioning style, and version if manual
    var versioning: string = tl.getInput('versioning');
    if (versioning == 'manual') {
        var versionNumber: string = tl.getInput('versioning');
    }

    var revVersion: string = versioning == 'automatic' ? '--rev-version' : '';

    var shareWith: string = tl.getInput('share-with');    
    var token: string = tl.getInput('token');
    
    // Deploy task to Marketplace
    runCommand(`tfx extension publish ` +
        `--manifest-globs ${globFilename} ` +
        `--share-with ${shareWith} ` +
        `--token ${token} `+ 
        revVersion,
        workingDir);
}

function IncreaseHotfixVersion(extension: any): any {
    var version = extension.version.split(`.`);
    var hotfix = parseInt(version[2]);
    hotfix++;
    version[2] = hotfix;
    extension.version = version.join(`.`);
    
    return extension;
}

function WriteFile(extension: any, fileName: string) {
    fs.writeFileSync(`./${fileName}`, JSON.stringify(extension, null, 2) , 'utf-8');
}

function LoadJson(filePath: string): any {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runCommand(command: string, workingDir?: string) {
    console.log(execSync(command, { cwd: workingDir }).toString());
}