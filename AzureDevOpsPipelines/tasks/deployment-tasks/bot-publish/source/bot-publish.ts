import { core } from "./core";

export class botPublish {

    private parametersPublish = {
        'code-dir': 'code-dir',
        'name': 'name',
        'proj-name': 'proj-name',
        'resource-group': 'resource-group',
        'version': 'version',
    };

    private core: core = new core;
    
    public botPublish(): void {
        const inputs: string = this.core.GetParameters(this.parametersPublish);
        
        this.core.run(`az bot publish ` +
            `--subscription ${this.core.subscriptionID} ` +
            `${inputs} ` +
            `--verbose`);
    }
}
