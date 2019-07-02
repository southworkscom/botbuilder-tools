using Newtonsoft.Json;
using RelayDeployer.DeploymentHelper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace TestRelay
{
    public static class Configuration
    {
        public static IDeploymentConfiguration GetConfiguration()
        {
            var folder = AppDomain.CurrentDomain.BaseDirectory;
            var file = "appsettings.json";

            return File.Exists(Path.Combine(folder, file))
                    ? DeserializeConfiguration(folder, file)
                    : CreateNewConfiguration(Path.Combine(folder, file));
        }

        private static IDeploymentConfiguration DeserializeConfiguration(string folder, string file)
        {
            using (StreamReader reader = new StreamReader(Path.Combine(folder, file)))
            {
                return JsonConvert.DeserializeObject<DeploymentConfiguration>(reader.ReadToEnd());
            }
        }

        private static IDeploymentConfiguration CreateNewConfiguration(string filePath)
        {
            var DeploymentConfiguration = new DeploymentConfiguration();
            using (var sw = new StreamWriter(filePath))
            {
                sw.Write(JsonConvert.SerializeObject(DeploymentConfiguration, Formatting.Indented));
            }

            return DeploymentConfiguration;
        }
    }
}
