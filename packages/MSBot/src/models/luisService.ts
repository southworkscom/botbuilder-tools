/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import { ILuisService, ServiceType } from '../schema';
import { ConnectedService } from './connectedService';

export class LuisService extends ConnectedService implements ILuisService {
    public readonly type: ServiceType = ServiceType.Luis;
    public appId: string = '';
    public authoringKey: string = '';
    public subscriptionKey: string = '';
    public version: string = '';

    constructor(source: ILuisService = {} as ILuisService) {
        super(source);
        const { appId = '', authoringKey = '', subscriptionKey = '', version = '' } = source;
        this.id = appId;
        Object.assign(this, { appId, authoringKey, subscriptionKey, version });
    }

    public toJSON(): ILuisService {
        const { appId, authoringKey, id, name, subscriptionKey, type, version } = this;
        return { type: ServiceType.Luis, id: appId, name, version, appId, authoringKey, subscriptionKey };
    }
}
