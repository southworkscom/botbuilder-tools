import { Core } from "./Core";

run();

function run(): void {
    var core = new Core();

    var inputFile = core.getInputFileName();
    var outputFile = core.getOutputFileName();

    core.transcribe(inputFile, outputFile);
}