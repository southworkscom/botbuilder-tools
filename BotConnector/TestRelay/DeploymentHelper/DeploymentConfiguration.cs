using System;
using System.Collections.Generic;
using System.Text;

namespace RelayDeployer.DeploymentHelper
{
    public struct DeploymentConfiguration
    {
        public string SubscriptionId { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string ResourceGroupName { get; set; }
        public string DeploymentName { get; set; }

        /// <summary>
        /// Must be specified for creating a new resource group
        /// </summary>
        public string ResourceGroupLocation { get; set; }
        public string TenantId { get; set; }
    }
}
