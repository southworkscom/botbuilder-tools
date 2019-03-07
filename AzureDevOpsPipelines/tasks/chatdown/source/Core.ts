import { IExecSyncResult, IExecOptions } from 'azure-pipelines-task-lib/toolrunner';
import { execSync } from "child_process";
import tl from 'azure-pipelines-task-lib';
import path from 'path';

export class Core {
    // This will contain either 'sudo' or nothing depending on the OS
    private prefix: string = '';

    constructor() {
        this.getPrefix();

        // TODO: Add validation to see if it is already installed
        console.log("Downloading and installing Chatdown...");
        this.run(`npm install -g chatdown`);
    }

    public transcribe(inputFile: string, exportFile: string): void {
        this.run(`chatdown ${inputFile} > ${exportFile} ${this.getStaticDate()}`);
    }

    public getInputFileName(): string {
        return tl.getInput('filename');
    }

    public getExportDirectory(): string {
        return tl.getInput('exportdirectory');
    }

    public getOutputFileName(): string {
        const fileName = `${path.basename(this.getInputFileName(), '.chat')}.transcript`;
        const directory: string = this.getExportDirectory();
        
        return path.join(directory, fileName);
    }

    private getStaticDate(): string {
        const input = tl.getInput('static');

        return input != null && input == "true" ? '--static' : '';
    }

    private getCWD(cwd: string): IExecOptions {

        return <IExecOptions> { cwd: tl.getInput(cwd) };
    }

    private GetParameters(parameters: any): string {
        const inputs: string[] = [];
        for (const key in parameters) {
            const input = tl.getInput(key);
            if (input != null) {
                inputs.push(`--${key} ${input}`);
            }
        }
        
        return inputs.join(' ');
    }

    private run(input: string, options?: IExecOptions): void{
        const command = `${this.prefix} ${input}`;
        console.log(`Running command: ${command}.`);
        try {
            console.log(execSync(command, options).toString());
        }
        catch (error) {
            this.LogError(`A problem ocurred: ${error.message}`);
        }
    }

    private LogError(message: string): void {
        tl.setResult(tl.TaskResult.Failed, message);
    }

    private getPrefix(): void {
        this.prefix = tl.osType() == "Linux" ? "sudo" : "";
    }
}
