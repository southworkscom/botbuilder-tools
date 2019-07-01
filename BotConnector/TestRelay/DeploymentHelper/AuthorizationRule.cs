namespace TestRelay.DeploymentHelper
{
    public struct AuthorizationRule
    {
        public string PrimaryConnectionString { get; set; }
        public string SecondaryConnectionString { get; set; }
        public string PrimaryKey { get; set; }
        public string SecondaryKey { get; set; }
        public string KeyName { get; set; }
    }
}
