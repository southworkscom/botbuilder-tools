/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import { IDispatchService, ServiceType } from '../schema';
import { ConnectedService } from './connectedService';

export class DispatchService extends ConnectedService implements IDispatchService {
    public readonly type: ServiceType = ServiceType.Dispatch;
    public appId: string = '';
    public authoringKey: string = '';
    public serviceIds: string[] = [];
    public subscriptionKey: string = '';
    public version: string = '';

    constructor(source: IDispatchService = {} as IDispatchService) {
        super(source);
        const { appId = '', authoringKey = '', serviceIds = [], subscriptionKey = '', version = '' } = source;
        this.id = appId;
        Object.assign(this, { appId, authoringKey, serviceIds, subscriptionKey, version });
    }

    public toJSON(): IDispatchService {
        const { appId, authoringKey, name, serviceIds, subscriptionKey, version } = this;
        return {  type: ServiceType.Dispatch, id: appId, name, appId, authoringKey, serviceIds, subscriptionKey, version };
    }
}
