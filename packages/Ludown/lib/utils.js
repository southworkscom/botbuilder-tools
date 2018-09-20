"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const path = require('path');
const intercept = require("intercept-stdout");
const unhook_intercept = intercept(function(txt) {
    const parentFolder = path.dirname(__dirname).split(path.sep).pop();
    return `${process.env.VERBOSE === 'verbose' ? `[${parentFolder}] ` : ''}${txt}`;
});
exports.unhook_intercept = unhook_intercept;
