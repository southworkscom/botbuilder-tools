"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("./Core");
const bot_publish_1 = require("./bot-publish");
const msbot_clone_1 = require("./msbot-clone");
const tl = require("azure-pipelines-task-lib");
run();
function run() {
    const cores = new Core_1.core();
    const publish = new bot_publish_1.botPublish();
    const clone = new msbot_clone_1.msbotClone();
    console.log(`Checking if ${tl.getInput('name')} already exist in ${tl.getInput('group')}`);
    if (cores.ValidateBot(tl.getInput('name'), tl.getInput('group'))) {
        console.log('It does, creating publish...');
        publish.botPublish();
    }
    else {
        console.log('It does not, cloning the bot...');
        clone.botClone();
    }
}
