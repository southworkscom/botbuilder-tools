import { botPublish } from "./bot-publish";

run();

function run(): void {
    const publish = new botPublish();
    
    publish.botPublish();
}