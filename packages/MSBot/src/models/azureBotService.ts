/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import { IAzureBotService, ServiceType } from '../schema';
import { ConnectedService } from './connectedService';

export class AzureBotService extends ConnectedService implements IAzureBotService {
    public readonly type = ServiceType.AzureBotService;
    public tenantId = '';
    public subscriptionId = '';
    public resourceGroup = '';

    constructor(source: IAzureBotService = {} as IAzureBotService) {
        super(source);
        const { tenantId = '', subscriptionId = '', resourceGroup = '' } = source;
        Object.assign(this, { tenantId, subscriptionId, resourceGroup });
    }

    public toJSON(): IAzureBotService {
        return {
            type: ServiceType.AzureBotService,
            id: this.id,
            name: this.name,
            tenantId: this.tenantId,
            subscriptionId: this.subscriptionId,
            resourceGroup: this.resourceGroup};
    }
}
