import { core } from "./core";

export class msbotClone {

    private parametersClone = {
        'name': 'name',
        'proj-name': 'proj-name',
        'code-dir': 'code-dir',
        'location': 'location',
        'sdkLanguage': 'sdkLanguage',
        'folder': 'folder',
        'appId': 'appId',
        'appSecret': 'appSecret',
        'luisAuthoringKey': 'luisAuthoringKey'
    };

    private core: core = new core;
    
    public botClone(): void {
        this.core.run(`npm install msbot -g`);

        var inputs: string = this.core.GetParameters(this.parametersClone);        
        this.core.run(`msbot clone services ` +
            `--subscriptionId ${this.core.subscriptionID} ` +
            ` ${inputs.replace('proj-name', 'proj-file')} ` +
            `--force ` +
            `--verbose`,
            this.core.getCWD('code-dir'));
    }
}