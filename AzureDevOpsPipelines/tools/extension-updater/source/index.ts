import tl from 'azure-pipelines-task-lib';
import { execSync } from "child_process";
import path from 'path';
import fs, { writeFile } from 'fs';

init();

function init(): void {
    // Instal TFX
    runCommand('npm install tfx-cli -g');

    // Get the working dir and glob file name from the selected file
    console.log('getting the inputs');
    const glob: string = tl.getInput('manifest-globs');
    const globFilename: string = path.basename(glob);
    const workingDir: string = path.dirname(glob);
    
    // Get Versioning style, and version if manual
    const versioning: string = tl.getInput('versioning');
    if (versioning == 'manual') {
        const versionNumber: string = tl.getInput('versioning');
    } else {
        var extension = LoadJson(glob);
        extension = IncreaseHotfixVersion(extension);
        WriteFile(extension, glob);
    }

    const revVersion: string = versioning == '' ? '--rev-version' : '';

    const shareWith: string = tl.getInput('share-with');    
    const token: string = tl.getInput('token');
    
    // Deploy task to Marketplace
    runCommand(`tfx extension publish ` +
        `--manifest-globs ${globFilename} ` +
        `--share-with ${shareWith} ` +
        `--token ${token} `+ 
        revVersion,
        workingDir);
}

function IncreaseHotfixVersion(extension: any): any {
    const version = getLastVersion().split(`.`);
    var hotfix = parseInt(version[2]);
    hotfix++;
    version[2] = hotfix.toString();
    extension.version = version.join(`.`);
    
    return extension;
}

function WriteFile(extension: any, fileName: string): void {
    fs.writeFileSync(`${fileName}`, JSON.stringify(extension, null, 2) , 'utf-8');
}

function LoadJson(filePath: string): any {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function runCommand(command: string, workingDir?: string): void {
    console.log(execSync(command, { cwd: workingDir }).toString());
}

function getLastVersion(): string {
    const extension: any = JSON.parse(execSync(
        `tfx extension show --json ` +
        `--publisher ${tl.getInput('publisher')} ` +
        `--extension-id ${tl.getInput('extensionid')} ` +
        `--token ${tl.getInput('token')}`,
    ).toString());
    return extension.versions[0].version;
}
