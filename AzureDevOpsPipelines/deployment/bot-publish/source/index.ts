import { botPublish } from "./bot-publish";

run();

function run(): void {
    var publish = new botPublish();
    
    publish.botPublish();
}