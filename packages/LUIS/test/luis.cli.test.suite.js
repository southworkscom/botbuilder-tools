const assert = require('assert');
const { exec } = require('child_process');
const luis = require.resolve('../bin/luis');
const AppObject = require.resolve('../examples/ApplicationCreateObject');
const pkg = require('../package.json');
const nock = require('nock');
const fs = require('fs-extra');
const testMockPath = './mockTest.js';

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
                let mockFile = './testdata/withallotherargs.mockdata.json';
                exec(`node ${testMockPath} ${mockFile} ${luis} --authoringKey dummy-key --region westeurope query --q "message to send" --appId dummy-app`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('401'));
                    done();
                });
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
                let mockFile = './testdata/withapplicationcreateobject.mockdata.json';
                exec(`node ${testMockPath} ${mockFile} ${luis} add app --in ${AppObject} --authoringKey dummyKey --region westus`, (error, stdout, stderr) => {
                    assert.equal(stdout, '');
                    assert(stderr.includes('Access denied due to invalid subscription key.'));
                    done();
                });
            });
        });
    });
});
