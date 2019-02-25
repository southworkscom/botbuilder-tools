import { core } from "./Core";
import { botPublish } from "./bot-publish";
import { msbotClone } from "./msbot-clone";
import tl = require("azure-pipelines-task-lib");

run();

function run(): void {
    const cores = new core();
    const publish = new botPublish();
    const clone = new msbotClone();
    
    console.log(`Checking if ${tl.getInput('name')} already exist in ${tl.getInput('resource-group')}`);
    if (cores.ValidateBot(tl.getInput('name'), tl.getInput('resource-group'))) {
        console.log('It does, creating publish...');
        publish.botPublish();
    } else {
        console.log('It does not, cloning the bot...');
        clone.botClone();
    }
}