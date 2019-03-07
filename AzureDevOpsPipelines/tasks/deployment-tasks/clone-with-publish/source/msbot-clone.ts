import { core } from "./core";
import { configuration } from "./configuration";

export class msbotClone {
    private config: configuration;
    private core: core;

    constructor (configuration: configuration) {
        this.config = configuration;
        this.core = new core(this.config);
    }
    
    public botClone(): void {
        this.core.installMsbot();

        if (this.config.parameters.luisAuthoringKey.value != null) {
            this.core.installLuis();
        }
        
        if (this.config.parameters.qnainstall.value == 'true') {
            this.core.installQna();
        }
        
        if (this.config.parameters.overwrite.value == 'true') {
            this.core.deleteBotFile();
        }

        this.core.run(`msbot clone services --verbose --force ` +
            `--subscriptionId ${this.config.subscriptionID} ` +
            this.core.paramsBuilder([
                this.config.parameters.name,
                this.config.parameters.appId,
                this.config.parameters.folder,
                this.config.parameters.codeDir,
                this.config.parameters.location,
                this.config.parameters.appSecret,
                this.config.parameters.projName,
                this.config.parameters.sdkLanguage,
                this.config.parameters.resourceGroup,
                this.config.parameters.luisAuthoringKey,
            ])
            .replace('--proj-name', '--proj-file')
            .replace('--resource-group','--groupName'),
            this.core.getCWD('code-dir'));
    }
}
