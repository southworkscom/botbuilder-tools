import { Core } from "./Core";

run();

function run(): void {
    const core = new Core();

    const inputFile = core.getInputFileName();
    const outputFile = core.getOutputFileName();

    core.transcribe(inputFile, outputFile);
}
