using RelayDeployer.DeploymentHelper;
using System;

namespace TestRelay
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine(
                " ****************************************************\n" +
                " * This program will deploy an Azure Relay service  *\n" +
                " *      with pre-configured Hybrid Connection       *\n" +
                " ****************************************************\n");

            var deploymentConfiguration = new DeploymentConfiguration
            {
                SubscriptionId = GetInput("Provide Subscription ID: "),
                TenantId = GetInput("Provide Tenant ID: "),
                ClientId = GetInput("Provide Client ID: "),
                ClientSecret = GetInput("Provide Client Secret: "),
                DeploymentName = GetInput("Provide Deployment Name: "),
                ResourceGroupLocation = GetInput("Provide Resource Group Location (if rource group does not exists): "),
                ResourceGroupName = GetInput("Provide Resource Group Name: ")
            };

            var deploymentHelper = new RelayDeployer.DeploymentHelper.RelayDeployer(deploymentConfiguration);
            deploymentHelper.DeployTemplate();

            Console.ReadKey();
        }

        private static string GetInput(string message)
        {
            Console.Write(message);
            return Console.ReadLine();
        }
    }
}
