/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion
import { BotConfiguration, ICosmosDBService, ServiceTypes } from 'botframework-config';
import * as chalk from 'chalk';
import * as program from 'commander';
import * as getStdin from 'get-stdin';
import * as txtfile from 'read-text-file';

program.Command.prototype.unknownOption = (flag: string): void => {
    console.error(chalk.default.redBright(`[msbot] Unknown arguments: ${flag}`));
    showErrorHelp();
};

interface IupdateCosmosDbArgs extends ICosmosDBService {
    bot: string;
    secret: string;
    stdin: boolean;
    input?: string;
}

program
    .name('msbot update cosmosdb')
    .description('update the bot to Azure CosmosDb Service')
    .option('--serviceName <serviceName>', 'Azure service name')
    .option('-n, --name <name>', 'friendly name (defaults to serviceName)')
    .option('-k, --key <key>', 'CosmosDB auth key')
    .option('-d, --database <database>', 'database name')
    .option('-c, --collection <collection>', 'collection name')

    .option('-b, --bot <path>', 'path to bot file.  If omitted, local folder will look for a .bot file')
    .option('--input <jsonfile>', 'path to arguments in JSON format { id:\'\',name:\'\', ... }')
    .option('--secret <secret>', 'bot file secret password for encrypting service secrets')
    .option('--stdin', 'arguments are passed in as JSON object via stdin')
    .action((cmd: program.Command, actions: program.Command) => undefined);

const command: program.Command = program.parse(process.argv);
const args: IupdateCosmosDbArgs = <IupdateCosmosDbArgs>{};
Object.assign(args, command);

if (process.argv.length < 3) {
    program.help();
} else {
    if (!args.bot) {
        BotConfiguration.loadBotFromFolder(process.cwd(), args.secret)
            .then(processArgs)
            .catch((reason: Error) => {
                console.error(chalk.default.redBright(`[msbot] ${reason.toString().split('\n')[0]}`));
                showErrorHelp();
            });
    } else {
        BotConfiguration.load(args.bot, args.secret)
            .then(processArgs)
            .catch((reason: Error) => {
                console.error(chalk.default.redBright(`[msbot] ${reason.toString().split('\n')[0]}`));
                showErrorHelp();
            });
    }
}

async function processArgs(config: BotConfiguration): Promise<BotConfiguration> {
    if (args.stdin) {
        Object.assign(args, JSON.parse(await getStdin()));
    } else if (args.input != null) {
        Object.assign(args, JSON.parse(await txtfile.read(<string>args.input)));
    }

    if (!args.serviceName || args.serviceName.length === 0) {
        throw new Error('Bad or missing --serviceName');
    }
    
    for (const service of config.services) {
        if (service.type === ServiceTypes.CosmosDB) {
            const cosmosService = <ICosmosDBService>service;
            if (cosmosService.serviceName === args.serviceName) {
                if (args.hasOwnProperty('name')) {
                    cosmosService.name = args.name;
                }
                if (args.key) {
                    cosmosService.key = args.key;
                }
                if (args.database) {
                    cosmosService.database = args.database;
                }
                if (args.collection) {
                    cosmosService.collection = args.collection;
                }
                await config.save(args.secret);
                process.stdout.write(JSON.stringify(cosmosService, null, 2));
                return config;
            }
        }
    }
    throw new Error(`[msbot] CosmosDB Service ${args.serviceName} was not found in the bot file`);
}

function showErrorHelp(): void {
    program.outputHelp((str: string) => {
        console.error(`[msbot] ${str}`);

        return '';
    });
    process.exit(1);
}
