Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('assert');
const util = require( "util" );
const {exec} = require('child_process');
const luis = require.resolve('../bin/luis');
const path = require('path');
const fs = require('fs');

const extension = '.spec.json';
const isDirectory = path => fs.lstatSync(path).isDirectory()
const getDirectories = folder => fs.readdirSync(folder).map(name => path.join(folder, name)).filter(isDirectory)

function runTests(directory) {
    getDirectories(directory).forEach(directory => {        
        const testSuite = directory.split(path.sep).pop()
        describe(testSuite, () => {
            getTestGroup(directory);
        });
    });
}

function getTestGroup(directory) {
    fs.readdirSync(directory).filter(file => file.endsWith(extension)).forEach(file => {
        const testGroup = JSON.parse(fs.readFileSync(`${directory}/${file}`, 'utf8'));
        describe(testGroup.GroupName, () => {
            executeGroup(testGroup.TestCollection);
            //var tests = JSON.parse(fs.readFileSync(`${directory}/${file}`, 'utf8'));
            //executeGroup(tests);
        });
    })
}

function executeGroup (tests) {
    tests.forEach((test) => {
        let command = `node ${luis}  ${test.args}`;

        if(test.resource) {
            command = getResources(test, command); }

        executeTest(test, command);
    });
}

function getResources (test, command) {
    test.resource.forEach(resource => {
        const AppObject = require.resolve(`../examples/${resource}`);
        command = util.format(command, AppObject)
    });

    return command;
}

function executeTest (test, command) {
    it(test.title, done => {                
        exec(command, (error, stdout, stderr) => {
            assert(stdout.includes(test.stdout));
            assert(stderr.includes(test.stderr));
            done();
        });
    }); 
}

exports.runTests = runTests;
