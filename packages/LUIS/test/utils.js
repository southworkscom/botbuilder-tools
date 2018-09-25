Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('assert');
const util = require( "util" );
const {exec} = require('child_process');
const luis = require.resolve('../bin/luis');
const { lstatSync, readdirSync } = require('fs');
const {join} = require('path')
const path = require('path');

const IsDirectory = __dirname => lstatSync(__dirname).isDirectory()
const GetDirectories = __dirname => readdirSync(__dirname).map(name => join(__dirname, name)).filter(IsDirectory)

function RunTests(directory) {
    GetDirectories(directory).forEach(directory => {        
        const testGroup = directory.split(path.sep).pop()
        describe(testGroup, () => {
            GetTestGroup(directory);
        });
    });
};

function GetTestGroup(directory) {
    const fs = require('fs');
    readdirSync(directory).forEach(file => {
        describe(file.slice(0, -5), () => {
            var tests = JSON.parse(fs.readFileSync(`${directory}/${file}`, 'utf8'));
            ExecuteGroup(tests);
        });
    })
}

function ExecuteGroup (tests) {
    tests.forEach((test) => {
        let command = `node ${luis}  ${test.args}`;

        if(test.resource) {
            command = GetResources(test, command); };

        ExecuteTest(test, command);
    });
};

function GetResources (test, command) {
    test.resource.forEach(resource => {
        const AppObject = require.resolve(`../examples/${resource}`);
        command = util.format(command, AppObject)
    });

    return command;
};

function ExecuteTest (test, command) {
    it(test.title, done => {                
        exec(command, (error, stdout, stderr) => {
            assert(stdout.includes(test.stdout));
            assert(stderr.includes(test.stderr));
            done();
        });
    }); 
};

exports.RunTests = RunTests;
