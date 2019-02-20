"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib");
const child_process_1 = require("child_process");
const path = require("path");
const fs = require("fs");
class core {
    constructor() {
        this.isLoggedIn = false;
        this.cliPasswordPath = "";
        this.servicePrincipalId = "";
        this.servicePrincipalKey = "";
        this.prefix = "";
        this.subscriptionID = "";
        this.getPrefix();
        this.subscriptionID = tl.getVariable('subscriptionID');
        if (this.subscriptionID == null) {
            this.loginAzureRM(tl.getInput("connectedServiceNameARM", true));
            tl.setVariable('subscriptionID', this.subscriptionID);
        }
    }
    loginAzureRM(connectedService) {
        const authScheme = tl.getEndpointAuthorizationScheme(connectedService, true);
        this.subscriptionID = tl.getEndpointDataParameter(connectedService, "SubscriptionID", true);
        if (authScheme.toLowerCase() == "serviceprincipal") {
            const authType = tl.getEndpointAuthorizationParameter(connectedService, 'authenticationType', true);
            let cliPassword;
            let servicePrincipalId = tl.getEndpointAuthorizationParameter(connectedService, "serviceprincipalid", false);
            if (authType == "spnCertificate") {
                tl.debug('certificate based endpoint');
                let certificateContent = tl.getEndpointAuthorizationParameter(connectedService, "servicePrincipalCertificate", false);
                cliPassword = path.join(tl.getVariable('Agent.TempDirectory') || tl.getVariable('system.DefaultWorkingDirectory'), 'spnCert.pem');
                fs.writeFileSync(cliPassword, certificateContent);
                this.cliPasswordPath = cliPassword;
            }
            else {
                tl.debug('key based endpoint');
                cliPassword = tl.getEndpointAuthorizationParameter(connectedService, "serviceprincipalkey", false);
                this.servicePrincipalId = servicePrincipalId;
                this.servicePrincipalKey = cliPassword;
            }
            var tenantId = tl.getEndpointAuthorizationParameter(connectedService, "tenantid", false);
            //login using svn
            this.throwIfError(tl.execSync("az", `login --service-principal -u "${servicePrincipalId}" -p "${cliPassword}" --tenant "${tenantId}"`), "Azure Login Failed!");
        }
        else if (authScheme.toLowerCase() == "managedserviceidentity") {
            //login using msi
            this.throwIfError(tl.execSync("az", "login --identity"), "Managed Service Identity Failed!");
        }
        else {
            throw console.error("Auth Scheme %s is not supported", authScheme);
        }
        this.isLoggedIn = true;
        //set the subscription imported to the current subscription
        this.throwIfError(tl.execSync("az", `account set --subscription "${this.subscriptionID}"`), "Error in setting up subscription");
    }
    throwIfError(resultOfToolExecution, errormsg) {
        if (resultOfToolExecution.code != 0) {
            tl.error("Error Code: [" + resultOfToolExecution.code + "]");
            if (errormsg) {
                tl.error("Error: " + errormsg);
            }
            throw resultOfToolExecution;
        }
    }
    getCWD(cwd) {
        return { cwd: tl.getInput(cwd) };
    }
    GetParameters(parameters) {
        let inputs = [];
        for (var key in parameters) {
            let input = tl.getInput(key);
            if (input != null) {
                inputs.push(`--${key} ${input}`);
            }
        }
        return inputs.join(' ');
    }
    run(command, options) {
        const cmd = `${this.prefix} ${command}`;
        console.log(`Running command: ${cmd}.`);
        try {
            console.log(child_process_1.execSync(cmd, options).toString());
        }
        catch (error) {
            this.LogError(`A problem ocurred: ${error.message}`);
        }
    }
    getPrefix() {
        this.prefix = tl.osType() == "Linux" ? "sudo" : "";
    }
    LogError(message) {
        tl.setResult(tl.TaskResult.Failed, message);
    }
}
exports.core = core;
