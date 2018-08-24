/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import * as url from 'url';
import { IQnAService, ServiceType } from '../schema';
import { ConnectedService } from './connectedService';

export class QnaMakerService extends ConnectedService implements IQnAService {
    public readonly type: ServiceType = ServiceType.QnA;
    public kbId: string = '';
    public subscriptionKey: string = '';
    public hostname: string = '';
    public endpointKey: string = '';

    constructor(source: IQnAService = {} as IQnAService) {
        super(source);
        let { id = '', name = '', kbId = '', subscriptionKey = '', endpointKey = '', hostname = '' } = source;
        this.id = kbId;
        if (hostname) {
            hostname = url.resolve(hostname, '/qnamaker');
        }
        Object.assign(this, { id, name, kbId, subscriptionKey, endpointKey, hostname });
    }

    public toJSON(): IQnAService {
        const { id, name, kbId, subscriptionKey, endpointKey, hostname } = this;
        return { type: ServiceType.QnA, id: kbId, name, kbId, subscriptionKey, endpointKey, hostname };
    }
}
