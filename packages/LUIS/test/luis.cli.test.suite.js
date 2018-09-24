const assert = require('assert');
const { exec } = require('child_process');
const luis = require.resolve('../bin/luis');
const AppObject = require.resolve('../examples/ApplicationCreateObject');
const pkg = require('../package.json');
const nock = require('nock');
const fs = require('fs-extra');
// If this is true, then LUIS responses will come from oracle files.
// If it is false, the LUIS service will be called and if there are changes you will get a new oracle file.
const mockLuis = true;

function ExpectedPath(file) {
    return __dirname + "/TestData/" + file;
}

function GetExpected(oracle, statusCode = 200) {
    var expected = fs.readJSONSync(oracle);
    if (mockLuis) {
        nock('https://westus.api.cognitive.microsoft.com')
            .post('/luis/api/v2.0/apps/')
            .reply(statusCode, expected);
    }
    return expected;
}

function TestResponse(file, done) {
    var expectedPath = ExpectedPath(file);
    var expected = GetExpected(expectedPath);
    done(expected);
}

describe('The LUIS cli tool', () => {

    describe('should perform the correct action and display the contents', () => {

        it('when using the "luis" arg', done =>{
            exec(`node ${luis} luis list apps`, (error, stdout, stderr) => {
                assert.equal(stdout, '');
                assert(stderr.includes('luis list apps --skip <integer> --take <integer>'));
                done();
            });
        });
        
        describe('with query command', () => {
            it('and no question', done =>{
                exec(`node ${luis} --authoringKey dummy-key --region westeurope query`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('missing -q'));
                    done();
                });
            });

            it('and no appid', done =>{
                exec(`node ${luis} --authoringKey dummy-key --region westeurope query --q "message to send"`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('missing --appid'));
                    done();
                });
            });

            it('and all other args', done =>{
                TestResponse('accessDeniedInvalidSubscription.json', (res)=>{
                    exec(`node ${luis} --authoringKey dummy-key --region westeurope query --q "message to send" --appId dummy-app`, (error, stdout, stderr) => {
                        assert.equal(stdout, '');
                        assert(stderr.includes('401'), stderr);
                        done();
                    });
                }, 401);
            });
        });
        describe('with set command', () => {
            it('and no valid subscription key', done =>{
                exec(`node ${luis} --set dummy`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('The authoringKey  is missing from the configuration.'));
                    done();
                });
            });

            it('and no verb', done =>{
                exec(`node ${luis} --set dummy --authoringKey dummyKey`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('verb is missing'));
                    done();
                });
            });
        });
        describe('with verb', () => {
            it('missing', done =>{
                exec(`node ${luis} --authoringKey dummyKey --region westus`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('verb is missing'));
                    done();
                });
            });

            it('and missing resource', done =>{
                exec(`node ${luis} add --authoringKey dummyKey --region westus`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('resource is missing'));
                    done();
                });
            });

            it('and missing --in type', done =>{
                exec(`node ${luis} add app --authoringKey dummyKey --region westus`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('The --in requires an input of type: ApplicationCreateObject'));
                    done();
                });
            });

            it('with ApplicationCreateObject', done =>{
                TestResponse('accessDeniedInvalidSubscription.json', (res)=>{
                    exec(`node ${luis} add app --in ${AppObject} --authoringKey dummyKey --region westus`, (error, stdout, stderr) => {
                        assert.equal(stdout, '');
                        assert(stderr.includes('Access denied due to invalid subscription key.'));
                        done();
                    });
                }, 401);
            });
        });
    });
});
