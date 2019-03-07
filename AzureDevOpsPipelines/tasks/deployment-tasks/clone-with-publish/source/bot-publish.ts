import { core } from "./core";
import { configuration } from "./configuration";

export class botPublish {
    private config: configuration;
    private core: core;

    constructor (configuration: configuration) {
        this.config = configuration;
        this.core = new core(this.config);
    }

    
    public botPublish(): void {
        this.core.run(`az bot publish --verbose --subscription ${this.config.subscriptionID} ` +
            this.core.paramsBuilder([
                this.config.parameters.name,
                this.config.parameters.version,
                this.config.parameters.codeDir,
                this.config.parameters.projName,
                this.config.parameters.resourceGroup,
            ]));
    }
}
