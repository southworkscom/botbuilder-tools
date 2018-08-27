/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
import { IFileService, ServiceType } from '../schema';
import { ConnectedService } from './connectedService';

export class FileService extends ConnectedService implements IFileService {
    public readonly type = ServiceType.File;
    public filePath = '';

    constructor(source: IFileService = {} as IFileService) {
        super(source);
        const { filePath = '' } = source;
        this.id = filePath;
        this.filePath = filePath;
    }

    public toJSON(): IFileService {
        return {
            type: ServiceType.File,
            id: this.filePath,
            name: this.name,
            filePath: this.filePath };
    }
}
