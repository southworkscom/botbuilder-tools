"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = require("./Core");
run();
function run() {
    var core = new Core_1.Core();
    var inputFile = core.getInputFileName();
    var outputFile = core.getOutputFileName();
    core.transcribe(inputFile, outputFile);
}