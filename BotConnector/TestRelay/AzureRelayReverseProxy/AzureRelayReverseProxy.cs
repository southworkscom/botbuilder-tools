// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Threading;
using System.Threading.Tasks;

namespace TestRelay.AzureRelayReverseProxy
{
    class AzureRelayReverseProxy
    {
        public string connectionString { get; set; }
        public Uri targetUri { get; set; }

        async Task RunAsync(string connectionString, Uri targetUri)
        {
            var hybridProxy = new HybridConnectionReverseProxy(connectionString, targetUri);
            await hybridProxy.OpenAsync(CancellationToken.None);

            Console.ReadLine();

            await hybridProxy.CloseAsync(CancellationToken.None);
        }
    }
}
