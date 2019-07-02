// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Threading;
using System.Threading.Tasks;

namespace TestRelay.AzureRelayReverseProxy
{
    class AzureRelayReverseProxyHandler
    {
        public string connectionString { get; set; }
        public Uri targetUri { get; set; }

        private HybridConnectionReverseProxy hybridProxy;

        public async Task OpenAsync()
        {
            hybridProxy = new HybridConnectionReverseProxy(connectionString, targetUri);
            
            await hybridProxy.OpenAsync(CancellationToken.None);
        }

        public async Task CloseAsync()
        {
            if (hybridProxy == null)
            {
                return;
            }

            await hybridProxy.CloseAsync(CancellationToken.None);
        }
    }
}
