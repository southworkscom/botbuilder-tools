const fs = require('fs-extra');
const nock = require('nock');
const path = require('path');
const pathToMockFile = path.resolve(process.argv[2]);
const pathToCLITool = path.resolve(process.argv[3]);

var mocks = fs.readJSONSync(pathToMockFile);
for (const key in mocks) {
	if (mocks.hasOwnProperty(key)) {
		const element = mocks[key];
		var nockObj = nock(element.url);
		var interceptor;
		if(element.method === "post"){
			interceptor = nockObj.post(element.uri);
		} else {
			interceptor = nockObj.get(element.uri);
		}
		interceptor.reply(element.response);
	}
}

process.argv.splice(0,2); //Don't remove needed params
require(pathToCLITool);