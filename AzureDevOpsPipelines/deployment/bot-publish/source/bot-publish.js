"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
class botPublish {
    constructor() {
        this.parametersPublish = {
            'resource-group': 'resource-group',
            'name': 'name',
            'proj-name': 'proj-name',
            'code-dir': 'code-dir',
            'version': 'version'
        };
        this.core = new core_1.core;
    }
    botPublish() {
        var inputs = this.core.GetParameters(this.parametersPublish);
        this.core.run(`az bot publish ` +
            `--subscription ${this.core.subscriptionID} ` +
            `${inputs} ` +
            `--verbose`);
    }
}
exports.botPublish = botPublish;
