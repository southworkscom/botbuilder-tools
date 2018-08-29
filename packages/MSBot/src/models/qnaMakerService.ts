/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import * as url from 'url';
import { IQnAService, ServiceType } from '../schema';
import { ConnectedService } from './connectedService';

export class QnaMakerService extends ConnectedService implements IQnAService {
    public readonly type = ServiceType.QnA;
    public kbId = '';
    public subscriptionKey = '';
    public hostname = '';
    public endpointKey = '';

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
        const id: string = this.id;
        const name: string = this.name;
        const kbId: string = this.kbId;
        const subscriptionKey:string = this.subscriptionKey;
        const endpointKey: string = this.endpointKey;
        const hostname: string = this.hostname;

        return { type: ServiceType.QnA, id: kbId, name, kbId, subscriptionKey, endpointKey, hostname };
    }
}
