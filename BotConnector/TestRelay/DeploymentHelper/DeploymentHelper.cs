using Microsoft.Azure.Management.ResourceManager;
using Microsoft.Azure.Management.ResourceManager.Fluent;
using Microsoft.Azure.Management.ResourceManager.Fluent.Authentication;
using Microsoft.Azure.Management.ResourceManager.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using ResourceManagementClient = Microsoft.Azure.Management.ResourceManager.ResourceManagementClient;

namespace RelayDeployer.DeploymentHelper
{
    /// <summary>
    /// This is a helper class for deploying an Azure Resource Manager template
    /// More info about template deployments can be found here https://go.microsoft.com/fwLink/?LinkID=733371
    /// </summary>
    public class DeploymentHelper
    {
        private readonly DeploymentConfiguration config;

        public DeploymentHelper(DeploymentConfiguration config)
        {
            this.config = config;
        }

        public void Run()
        {
            // Try to obtain the service credentials
            var credentialFactory = new AzureCredentialsFactory();
            var serviceCreds = credentialFactory.FromServicePrincipal(
                                config.ClientId,
                                config.ClientSecret,
                                config.TenantId,
                                AzureEnvironment.AzureGlobalCloud);

            // Read the template and parameter file contents
            JObject templateFileContents = GetJsonFileContents("TestRelay.template.json");
            JObject parameterFileContents = GetJsonFileContents("TestRelay.parameters.json");

            // Assign the deplyment name specified by the user
            parameterFileContents["parameters"]["namespaces_relay_name"]["value"] = config.DeploymentName;

            // Create the resource manager client
            ResourceManagementClient resourceManagementClient = new ResourceManagementClient(serviceCreds)
            {
                SubscriptionId = config.SubscriptionId
            };

            // Create or check that resource group exists
            EnsureResourceGroupExists(resourceManagementClient, config.ResourceGroupName, config.ResourceGroupLocation);

            // Start a deployment
            DeployTemplate(resourceManagementClient, config.ResourceGroupName, config.DeploymentName, templateFileContents, parameterFileContents);
        }

        /// <summary>
        /// Reads a JSON file from the specified path
        /// </summary>
        /// <param name="pathToJson">The full path to the JSON file</param>
        /// <returns>The JSON file contents</returns>
        private JObject GetJsonFileContents(string fileName)
        {
            var assembly = Assembly.GetExecutingAssembly();

            using (Stream stream = assembly.GetManifestResourceStream(fileName))
            using (StreamReader file = new StreamReader(stream))
            {
                using (JsonTextReader reader = new JsonTextReader(file))
                {
                    return (JObject)JToken.ReadFrom(reader);
                }
            }
        }

        /// <summary>
        /// Ensures that a resource group with the specified name exists. If it does not, will attempt to create one.
        /// </summary>
        /// <param name="resourceManagementClient">The resource manager client.</param>
        /// <param name="resourceGroupName">The name of the resource group.</param>
        /// <param name="resourceGroupLocation">The resource group location. Required when creating a new resource group.</param>
        private async static void EnsureResourceGroupExists(ResourceManagementClient resourceManagementClient, string resourceGroupName, string resourceGroupLocation)
        {
            if (await resourceManagementClient.ResourceGroups.CheckExistenceAsync(resourceGroupName) != true)
            {
                Console.WriteLine(string.Format("Creating resource group '{0}' in location '{1}'", resourceGroupName, resourceGroupLocation));
                var resourceGroup = new ResourceGroup
                {
                    Location = resourceGroupLocation
                };

                await resourceManagementClient.ResourceGroups.CreateOrUpdateAsync(resourceGroupName, resourceGroup);
            }
            else
            {
                Console.WriteLine(string.Format("Using existing resource group '{0}'", resourceGroupName));
            }
        }

        /// <summary>
        /// Starts a template deployment.
        /// </summary>
        /// <param name="resourceManagementClient">The resource manager client.</param>
        /// <param name="resourceGroupName">The name of the resource group.</param>
        /// <param name="deploymentName">The name of the deployment.</param>
        /// <param name="templateFileContents">The template file contents.</param>
        /// <param name="parameterFileContents">The parameter file contents.</param>
        private static void DeployTemplate(ResourceManagementClient resourceManagementClient, string resourceGroupName, string deploymentName, JObject templateFileContents, JObject parameterFileContents)
        {
            Console.WriteLine(string.Format("Starting template deployment '{0}' in resource group '{1}'", deploymentName, resourceGroupName));

            var deployment = new Deployment
            {
                Properties = new DeploymentProperties
                {
                    Mode = DeploymentMode.Incremental,
                    Template = templateFileContents,
                    Parameters = parameterFileContents["parameters"].ToObject<JObject>()
                }
            };

            var deploymentResult = resourceManagementClient.Deployments.CreateOrUpdate(resourceGroupName, deploymentName, deployment);
            Console.WriteLine(string.Format("Deployment status: {0}", deploymentResult.Properties.ProvisioningState));
        }
    }
}
