# Azure DevOps Pipelines task for bot deployment

## How to use it

#### Pre-requisites

- Have **[NodeJS](https://nodejs.org/es/download/)** installed
- Have **[TypeScript](https://www.npmjs.com/package/typescript)** installed
- Have **TFS Cross Platform Command Line** Interface installed
  - It is installed with the command `npm i -g tfx-cli`
- Have a [Visual Studio Marketplace Publisher](https://marketplace.visualstudio.com/manage/createpublisher) created

#### Compile and create vsix file

1. Clone the repo

2. From inside the folder `tasks\deployment-tasks\clone-with-publish\source` run the command `tsc`  to compile the TypeScript files into JavaScript files

3. Go to `tasks\deployment-tasks\clone-with-publish` and run the command `tfx extension create `

   **Note:** If you are updating an already deployed version, it is necessary to increase at least the minor version of the task. It is found in `vss-extennsion.json`

4. Go to `Manage Publishers & Extensions` of your VS Marketplace Publisher and upload or update the created vsix file

5. From inside `Manage Publishers & Extensions` share the task with your organization

#### Add the task to your DevOps Organization

1. Go to your Azure DevOps organizations settings
2. Select  `Extensions`
3. Find the shared extension and install it
4. The task now will be available to use on any pipeline

#### Use the task in a pipeline

1. Select or create a new pipeline
2. Add the new task to the agent

3. Configure the following fields:
   - **Azure Subscription:** The subscription to the Azure portal through a *Service Principal*
   - **Resource Group:** Name of the resource group where the bot will be deployed/updated
   - **Project File Name:** Name of the `.csproj` of the bot project
   - **Root Folder:** Root folder of the project
   - **Name of the Bot:** Name of the bot to create or update
   - **Version of the Bot:** SDK version of the bot
   - **Location:** Select the server location of the service
   - **SDK Languaje:** Either `C#` or `NodeJS`. **Note:** Currently only `C#` is supported
   - **Folder:** Path to the msbot clone deployment script
   - **App ID:** App ID of the bot
   - **App Secret:** App Secret of the bot
   - **LUIS Key:** Optional. API Key of the LUIS service, if needed
   - **Install QnA:** Whether to install QnA or not. Default: *false*
   - **Overwrite Bot File:** When deploying a bot for the first time, MSBot will create a `.bot` file, however, if the file already exist it will fail to deploy. Checking this will delete the bot file, if it exists, before attempting to deploy it
4. Deploy or update your bot file

#### How it works

When the task is executed, it checks whether if the bot exists in the specified resource group by executing `az bot show`.

***Deployment***

If the bot doesn't exist in the resource group, it will execute a *cloning* of the bot, that is, it will create the bot in the resource group by executing `msbot clone services`. This will clone the bot and all its services.

***Update***

If the bot already exist in the resource group, it will execute a *publish*, it will update the already deployed bot. This process is a more complex than cloning the bot, because not only it does updates the deployed bot but also checks each service associated with the bot. 

It check if the service is already created in the Azure resource group, if it does then it will update the service. If it doesn't then it will create the new service in the Azure resource group.

---

## Technical information

#### index.ts

This file is the entry point of  the task. It will check if it is necessary to either clone or publish by using the `az bot show` command.

#### configuration.ts

This file deals with the logging with the Azure Resource manager and getting the configured parameters. It also check if it the task is being executed in Pipelines or as command line. This is used to get the parameters values either by using the Pipelines interface or using *minimist* when run as command line outside pipelines.

#### core.ts

This class contains common methods used by other classes, such as running commands, and IO methods.

#### bot-publish.ts

This class contains all the logic used when publishing a bot.

#### msbot-clone.ts

This class contains all the logic used when cloning a bot.