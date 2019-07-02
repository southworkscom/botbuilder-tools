using Newtonsoft.Json;
using RelayDeployer.DeploymentHelper;
using System;
using System.IO;
using System.Threading.Tasks;
using TestRelay.AzureRelayReverseProxy;

namespace TestRelay
{
    class Program
    {
        static AzureRelayReverseProxyHandler azureRelayReverseProxyHandler;

        static void Main()
        {
            var deploymentHelper = new RelayDeployer.DeploymentHelper.RelayDeployer(Configuration.GetConfiguration());

            deploymentHelper.DeployTemplate();

            Console.WriteLine(deploymentHelper.GetAuthorizationRule("relay-rule").PrimaryConnectionString);

            Console.CancelKeyPress += new ConsoleCancelEventHandler(ConsoleCancelKeyPressAsync);

            // TO-DO: Read from appsettings.json
            var conString = "{your AZ HybridConnection Endpoint}";

            // TO-DO: Read from appsettings.json
            var targetUri = "{your Target URI}";

            azureRelayReverseProxyHandler = new AzureRelayReverseProxyHandler() { connectionString = conString, targetUri = new Uri(targetUri) };

            OpenReverseProxy().Wait();

            Console.ReadKey();
        }

        static async Task OpenReverseProxy()
        {
            if (azureRelayReverseProxyHandler != null)
            {
                await azureRelayReverseProxyHandler.OpenAsync();
            }
        }

        static async void ConsoleCancelKeyPressAsync(object sender, ConsoleCancelEventArgs e)
        {
            try
            {
                if (azureRelayReverseProxyHandler != null)
                {
                    await azureRelayReverseProxyHandler.CloseAsync();
                }

                // Successfully completed
                Environment.Exit(0);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An Exception ocurred: {ex.Message}");
            }
        }
    }
}
