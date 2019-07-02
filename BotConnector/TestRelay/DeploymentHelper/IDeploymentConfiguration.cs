// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

namespace RelayDeployer.DeploymentHelper
{
    public interface IDeploymentConfiguration
    {
        string ClientId { get; set; }
        string ClientSecret { get; set; }
        string DeploymentName { get; set; }
        string ResourceGroupLocation { get; set; }
        string ResourceGroupName { get; set; }
        string SubscriptionId { get; set; }
        string TenantId { get; set; }
    }
}
