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