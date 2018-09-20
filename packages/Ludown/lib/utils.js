"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const pkg = require('../package.json');
const intercept = require("intercept-stdout");
const unhook_intercept = intercept(function(txt) {
    return `${process.env.VERBOSE === 'verbose' ? `[${pkg.name}] ` : ''}${txt}`;
});
exports.unhook_intercept = unhook_intercept;