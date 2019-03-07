import { execSync } from "child_process";
import { configuration } from "./configuration";
import { botPublish } from "./bot-publish";
import { msbotClone } from "./msbot-clone";

run();

function run(): void {
    const config = new configuration();
    //const publish = new botPublish(config);
    
    console.log(`Checking if ${config.parameters.name.value} already exist in ${config.parameters.resourceGroup.value}`);
    if (ValidateBot(config.parameters.name.value, config.parameters.resourceGroup.value)) {
        console.log('It does, creating publish...');
        const publish = new botPublish(config);
        publish.botPublish();
    } else {
        console.log('It does not, cloning the bot...');
        const clone = new msbotClone(config);
        clone.botClone();
    }
}

function ValidateBot(name: string, group: string): boolean {
    try {
        execSync(`az bot show -n ${name} -g ${group}`);
        return true;
    } catch (error) {
        return false;
    }
}
