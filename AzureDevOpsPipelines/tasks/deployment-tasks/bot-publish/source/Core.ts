import tl from 'azure-pipelines-task-lib';
import { IExecSyncResult, IExecOptions } from 'azure-pipelines-task-lib/toolrunner';
import { execSync } from "child_process";
import path from 'path';
import fs from 'fs';

export class core {
    public subscriptionID: string = "";
    
    private isLoggedIn: boolean = false;
    private cliPasswordPath: string = "";
    private servicePrincipalId: string = "";
    private servicePrincipalKey: string = "";
    private prefix: string = "";

    constructor() {
        this.getPrefix();
        this.subscriptionID = tl.getVariable('subscriptionID');
        
        if (this.subscriptionID == null) {
            this.loginAzureRM(tl.getInput("connectedServiceNameARM", true));
            tl.setVariable('subscriptionID', this.subscriptionID);
        }
    }

    public GetParameters(parameters: any): string {
        const inputs: string[] = [];

        for (const key in parameters) {
            const input = tl.getInput(key);

            if (input != null) {
                inputs.push(`--${key} ${input}`);
            }
        }
        
        return inputs.join(' ');
    }

    public run(command: string, options?: IExecOptions): void{
        const cmd = `${this.prefix} ${command}`;
        console.log(`Running command: ${cmd}.`);
        try {
            console.log(execSync(cmd, options).toString());
        }
        catch (error) {
            this.LogError(`A problem ocurred: ${error.message}`);
        }
    }

    private loginAzureRM(connectedService: string): void {

        const authScheme: string = tl.getEndpointAuthorizationScheme(connectedService, true);
        this.subscriptionID = tl.getEndpointDataParameter(connectedService, "SubscriptionID", true);

        if(authScheme.toLowerCase() == "serviceprincipal") {
            const authType: string =
                tl.getEndpointAuthorizationParameter(connectedService, 'authenticationType', true);
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
            tl.execSync("az", `account set --subscription "${this.subscriptionID}"`),
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

    private getCWD(cwd: string): IExecOptions {
        return <IExecOptions> { cwd: tl.getInput(cwd) };
    }

    private getPrefix(): void {
        this.prefix = tl.osType() == "Linux" ? "sudo" : "";
    }

    private LogError(message: string): void {
        tl.setResult(tl.TaskResult.Failed, message);
    }
}
