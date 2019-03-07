import tl from 'azure-pipelines-task-lib';
import { configuration } from "./configuration";
import { IExecOptions } from 'azure-pipelines-task-lib/toolrunner';
import { execSync } from "child_process";
import path from 'path';
import fs from 'fs';

export class core {
    private config: configuration;

    constructor (configuration: configuration) {
        this.config = configuration;
    }

    public getCWD(directory: string): IExecOptions {
        return <IExecOptions> { cwd: tl.getInput(directory) };
    }

    public getArgumentValue(input: string): string {
        return tl.getInput(input);
    }

    public deleteBotFile(): void {
        this.deleteFile(path.join(
            this.config.parameters.codeDir.value,
            this.config.parameters.name.value)
        );
    }

    public run(command: string, options?: IExecOptions): void{
        const cmd = `${this.config.prefix} ${command}`;
        console.log(`Running command: ${cmd}.`);
        try {
            console.log(execSync(cmd, options).toString());
        }
        catch (error) {
            this.LogError(`A problem ocurred: ${error.message}`);
        }
    }

    public runPlain(command: string): string {
        return execSync(command).toString();
    }

    public installMsbot(): void {
        this.run(`npm install msbot -g`);
    }

    public installLuis(): void {
        this.run(`npm install luis-apis -g`);
    }

    public installQna(): void {
        this.run(`npm install qnamaker -g`);
    }

    public LoadJson(filePath: string): any {
        return JSON.parse(fs.readFileSync(filePath).toString().trim());
    }

    public paramsBuilder(params: {name: string, value: string}[]): string {
        var fullParams: string[] = [];
        params.forEach(param => {
            if (param.value != null) {
                fullParams.push(`--${param.name} ${param.value}`);
                //fullParams.push(param.value != '' ? `--${param.name} ${param.value}` : '');
            }
        });
        
        console.log(fullParams);
        return fullParams.join(' ');
    }

    private deleteFile(filePath: string): void {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    private LogError(message: string): void {
        tl.setResult(tl.TaskResult.Failed, message);
    }
}
