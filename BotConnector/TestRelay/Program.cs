using Newtonsoft.Json;
using RelayDeployer.DeploymentHelper;
using System;
using System.IO;

namespace TestRelay
{
    class Program
    {
        static void Main()
        {
            var deploymentHelper = new RelayDeployer.DeploymentHelper.RelayDeployer(Configuration.GetConfiguration());
            
            deploymentHelper.DeployTemplate();
            
            Console.WriteLine(deploymentHelper.GetAuthorizationRule("relay-rule").PrimaryConnectionString);

            Console.ReadKey();
        }
    }
}
