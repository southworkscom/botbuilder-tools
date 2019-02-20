import { core } from "./core";

export class botPublish {

    private parametersPublish = {
        'resource-group': 'resource-group',
        'name': 'name',
        'proj-name': 'proj-name',
        'code-dir': 'code-dir',
        'version': 'version'
    };

    private core: core = new core;
    
    public botPublish(): void {
        var inputs: string = this.core.GetParameters(this.parametersPublish);
        
        this.core.run(`az bot publish ` +
            `--subscription ${this.core.subscriptionID} ` +
            `${inputs} ` +
            `--verbose`);
    }
}