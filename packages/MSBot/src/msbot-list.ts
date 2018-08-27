/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import * as chalk from 'chalk';
import * as program from 'commander';
import * as process from 'process';
import { BotConfig } from './BotConfig';
import { IBotConfig, IConnectedService } from './schema';

program.Command.prototype.unknownOption = function (flag: any): void {
    console.error(chalk.default.redBright(`Unknown arguments: ${flag}`));
    showErrorHelp();
};

interface ListArgs {
    bot: string;
    secret: string;
}

program
    .name('msbot list')
    .option('-b, --bot <path>', 'path to bot file.  If omitted, local folder will look for a .bot file')
    .option('--secret <secret>', 'bot file secret password for encrypting service secrets')
    .action((cmd: program.Command, actions: program.Command) => {
    });

const parsed: ListArgs = <ListArgs><any>program.parse(process.argv);

if (!parsed.bot) {
    BotConfig.LoadBotFromFolder(process.cwd(), parsed.secret)
        .then(processListArgs)
        .catch((reason: Error) => {
            console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
            showErrorHelp();
        });
} else {
    BotConfig.Load(parsed.bot, parsed.secret)
        .then(processListArgs)
        .catch((reason: Error) => {
            console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
            showErrorHelp();
        });
}

async function processListArgs(config: BotConfig): Promise<BotConfig> {
    const services: IConnectedService[] = config.services;

    console.log(JSON.stringify(<IBotConfig>{
        name: config.name,
        description: config.description,
        services: config.services
    },                         null, 4));
    return config;
}

function showErrorHelp(): void {
    program.outputHelp((str: string) => {
        console.error(str);
        return '';
    });
    process.exit(1);
}
