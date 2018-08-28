/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import * as chalk from 'chalk';
import * as program from 'commander';
import { BotConfig } from './BotConfig';
import { IConnectedService } from './schema';

program.Command.prototype.unknownOption = function (flag: any): void {
    console.error(chalk.default.redBright(`Unknown arguments: ${flag}`));
    showErrorHelp();
};

interface DisconnectServiceArgs {
    bot: string;
    idOrName: string;
}

program
    .name('msbot disconnect')
    .arguments('<service_id_or_Name>')
    .description('disconnect a connected service by id or name')
    .option('-b, --bot <path>', 'path to bot file.  If omitted, local folder will look for a .bot file')
    .action((idOrName: program.Command, actions: program.Command) => {
        actions.idOrName = idOrName;
    });

const args: DisconnectServiceArgs = <DisconnectServiceArgs><any>program.parse(process.argv);

if (process.argv.length < 3) {
    program.help();
} else {
    if (!args.bot) {
        BotConfig.LoadBotFromFolder(process.cwd())
            .then(processConnectAzureArgs)
            .catch((reason: Error) => {
                console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
                showErrorHelp();
            });
    } else {
        BotConfig.Load(args.bot)
            .then(processConnectAzureArgs)
            .catch((reason: Error) => {
                console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
                showErrorHelp();
            });
    }
}

async function processConnectAzureArgs(config: BotConfig): Promise<BotConfig> {
    if (!args.idOrName) {
        throw new Error('missing id or name of service to disconnect');
    }

    const removedService: IConnectedService = config.disconnectServiceByNameOrId(args.idOrName);
    if (removedService != null) {
        await config.save();
        process.stdout.write(`Disconnected ${removedService.type}:${removedService.name} ${removedService.id}`);
    }

    return config;
}

function showErrorHelp(): void {
    program.outputHelp((str: string) => {
        console.error(str);
        return '';
    });
    process.exit(1);
}
