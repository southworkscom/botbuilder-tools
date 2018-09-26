Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('assert');
const util = require( "util" );
const {exec} = require('child_process');
const luis = require.resolve('../bin/luis');
const fs = require('fs');
const extension = '.spec.json';

function runTests(file) {
    if (validatePath(file, 'hub file')) {
        const HubFile = JSON.parse(fs.readFileSync(file, 'utf8'));

        HubFile.forEach(suite => {
            describe(suite.SuiteName, () => {
                getTestGroup(__dirname + suite.SuitePath);
            });        
        });
    }
}

function getTestGroup(directory) {
    if (validatePath(directory, 'suite directory')) {
        fs.readdirSync(directory).filter(file => file.endsWith(extension)).forEach(file => {
            const testGroup = JSON.parse(fs.readFileSync(`${directory}/${file}`, 'utf8'));

            describe(testGroup.GroupName, () => {
                executeGroup(testGroup.TestCollection);
            });
        })
    }
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
        const resourcePath = `../examples/${resource}`;
        if (validatePath(resourcePath, 'resource')) {
            const AppObject = require.resolve(resourcePath);
            command = util.format(command, AppObject)
        }
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

function validatePath (file, desc) {
    if (fs.existsSync(file)) {
        return true;
    } else {
        console.warn(`WARNING: The especified ${desc} does not exist: ${file}`);
        return false;
    }
}

exports.runTests = runTests;
