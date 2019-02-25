"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
class msbotClone {
    constructor() {
        this.parametersClone = {
            'name': 'name',
            'resource-group': 'resource-group',
            'proj-name': 'proj-name',
            'code-dir': 'code-dir',
            'location': 'location',
            'sdkLanguage': 'sdkLanguage',
            'folder': 'folder',
            'appId': 'appId',
            'appSecret': 'appSecret',
            'luisAuthoringKey': 'luisAuthoringKey'
        };
        this.core = new core_1.core;
    }
    botClone() {
        this.core.run(`npm install msbot -g`);
        var inputs = this.core.GetParameters(this.parametersClone);
        this.core.run(`msbot clone services ` +
            `--subscriptionId ${this.core.subscriptionID} ` +
            ` ${inputs.replace('proj-name', 'proj-file').replace('resource-group', 'groupName')} ` +
            `--force ` +
            `--verbose`, this.core.getCWD('code-dir'));
    }
}
exports.msbotClone = msbotClone;
