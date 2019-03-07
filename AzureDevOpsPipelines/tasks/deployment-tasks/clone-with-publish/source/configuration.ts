
import fs from 'fs';
import path from 'path';
import tl from 'azure-pipelines-task-lib';
import min from 'minimist';
import { IExecSyncResult } from 'azure-pipelines-task-lib/toolrunner';

export class configuration {
    public subscriptionID: string = "";
    public prefix: string = "";
    public parameters:{ [index:string] : {name: string, value: string} } = {
        appId: { name: 'appId', value: '' },
        appSecret: { name: 'appSecret', value: '' },
        codeDir: { name: 'code-dir', value: '' },
        folder: { name: 'folder', value: '' },
        location: { name: 'location', value: '' },
        luisAuthoringKey: { name: 'luisAuthoringKey', value: '' },
        name: { name: 'name', value: '' },
        overwrite: { name: 'overwrite', value: '' },
        projName: { name: 'proj-name', value: '' },
        qnainstall: { name: 'qnainstall', value: '' },
        resourceGroup: { name: 'resource-group', value: '' },
        sdkLanguage: { name: 'sdkLanguage', value: '' },
        secretId: { name: 'secretid', value: '' },
        version: { name: 'version', value: '' },
    }
    
    private isLoggedIn: boolean = false;
    private cliPasswordPath: string = "";
    private servicePrincipalId: string = "";
    private servicePrincipalKey: string = "";

    constructor() {
        // Check if we are running on an agent
        if (typeof tl.getVariable('Agent.Version') !== 'undefined') {
            this.getParameters(this.getAgentParameter);
        } else {
            this.getParameters(this.getCliParameter);
        }
        
        this.getPrefix();
        this.subscriptionID = tl.getVariable('subscriptionID');
        
        if (!this.isLoggedIn) {
            this.loginAzureRM(tl.getInput('connectedServiceNameARM', true));
            tl.setVariable('subscriptionID', this.subscriptionID);
        }
    }

    private loginAzureRM(connectedService: string): void {
        const authScheme: string = tl.getEndpointAuthorizationScheme(connectedService, true);
        this.subscriptionID = tl.getEndpointDataParameter(connectedService, "SubscriptionID", true);

        if(authScheme.toLowerCase() == "serviceprincipal") {
            const authType: string = tl.getEndpointAuthorizationParameter(connectedService, 'authenticationType', true);
            let cliPassword: string;
            const servicePrincipalId: string =
                tl.getEndpointAuthorizationParameter(connectedService, "serviceprincipalid", false);

            if (authType == "spnCertificate") {
                tl.debug('certificate based endpoint');
                const certificateContent: string =
                    tl.getEndpointAuthorizationParameter(connectedService, "servicePrincipalCertificate", false);
                cliPassword = 
                    path.join(tl.getVariable('Agent.TempDirectory') || 
                    tl.getVariable('system.DefaultWorkingDirectory'), 'spnCert.pem');
                fs.writeFileSync(cliPassword, certificateContent);
                this.cliPasswordPath = cliPassword;
            } else {
                tl.debug('key based endpoint');
                cliPassword = tl.getEndpointAuthorizationParameter(connectedService, "serviceprincipalkey", false);
                this.servicePrincipalId = servicePrincipalId;
                this.servicePrincipalKey = cliPassword;
            }
            
            const tenantId: string = tl.getEndpointAuthorizationParameter(connectedService, "tenantid", false);
            //login using svn
            this.throwIfError(
                tl.execSync(
                    "az",
                    `login --service-principal -u "${servicePrincipalId}" -p "${cliPassword}" --tenant "${tenantId}"`),
                "Azure Login Failed!");
        } else if(authScheme.toLowerCase() == "managedserviceidentity") {
            //login using msi
            this.throwIfError(tl.execSync("az", "login --identity"), "Managed Service Identity Failed!");
        } else {
            throw console.error("Auth Scheme %s is not supported", authScheme);
        }

        this.isLoggedIn = true;
        //set the subscription imported to the current subscription
        this.throwIfError(
            tl.execSync(
                "az",
                `account set --subscription "${this.subscriptionID}"`),
            "Error in setting up subscription");
    }

    private throwIfError(resultOfToolExecution: IExecSyncResult, errormsg?: string): void {
        if (resultOfToolExecution.code != 0) {
            tl.error("Error Code: [" + resultOfToolExecution.code + "]");

            if (errormsg) {
                tl.error("Error: " + errormsg);
            }

            throw resultOfToolExecution;
        }
    }

    private getPrefix(): void {
        this.prefix = tl.osType() == "Linux" ? "sudo" : "";
    }

    private getParameters(funcGetInput: Function): void {
        Object.keys(this.parameters).forEach((parameterName: string) => {
            this.parameters[parameterName].value = funcGetInput(this.parameters[parameterName].name);
        });
    }

    private getAgentParameter: Function = function(parameter: string): string {
        return tl.getInput(parameter);
    }

    private getCliParameter: Function = function(parameter: string): string {
        return min(process.argv.slice(2))[parameter];
    }
    
}
