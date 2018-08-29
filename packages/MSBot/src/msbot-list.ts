/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import * as chalk from 'chalk';
import * as program from 'commander';
import * as process from 'process';
import { BotConfig } from './BotConfig';
import { IBotConfig } from './schema';

program.Command.prototype.unknownOption = function (flag: any) {
    console.error(chalk.default.redBright(`Unknown arguments: ${flag}`));
    showErrorHelp();
};

interface ListArgs {
    bot: string;
    secret: string;
    [key: string]: string;
}

program
    .name('msbot list')
    .option('-b, --bot <path>', 'path to bot file.  If omitted, local folder will look for a .bot file')
    .option('--secret <secret>', 'bot file secret password for encrypting service secrets')
    .action((cmd, actions) => {
    });

const args: ListArgs = {
    bot: '',
    secret: ''
};

const commands: program.Command = program.parse(process.argv);
for (const i of commands.args) {
    if (args.hasOwnProperty(i)) {
        args[i] = commands[i];
    }
}

if (!args.bot) {
    BotConfig.LoadBotFromFolder(process.cwd(), args.secret)
        .then(processListArgs)
        .catch((reason) => {
            console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
            showErrorHelp();
        });
} else {
    BotConfig.Load(args.bot, args.secret)
        .then(processListArgs)
        .catch((reason) => {
            console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
            showErrorHelp();
        });
}

async function processListArgs(config: BotConfig): Promise<BotConfig> {
    const services = config.services;

    console.log(JSON.stringify(<IBotConfig>{
        name: config.name,
        description: config.description,
        services: config.services
    },                         null, 4));
    return config;
}

function showErrorHelp() {
    program.outputHelp((str) => {
        console.error(str);
        return '';
    });
    process.exit(1);
}
