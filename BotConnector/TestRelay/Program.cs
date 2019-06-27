using RelayDeployer.DeploymentHelper;
using System;

namespace TestRelay
{
    class Program
    {
        static void Main()
        {
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

            DeploymentHelper deploymentHelper = new DeploymentHelper(deploymentConfiguration);
            deploymentHelper.Run();
        }

        private static string GetInput(string message)
        {
            Console.Write(message);
            return Console.ReadLine();
        }
    }
}
