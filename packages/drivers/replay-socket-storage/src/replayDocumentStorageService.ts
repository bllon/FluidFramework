/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as api from "@prague/container-definitions";

/**
 * Document storage service for the replay driver...just does a default implementation for
 * all the methods
 */
export class ReplayDocumentStorageService implements api.IDocumentStorageService  {
    public get repositoryUrl(): string {
        throw new Error("Invalid operation");
    }

    public async getSnapshotTree(version?: api.IVersion): Promise<api.ISnapshotTree | null> {
        return version ? Promise.reject("Invalid operation") : null;
    }

    public async getVersions(versionId: string, count: number): Promise<api.IVersion[]> {
       return [];
    }

    public async read(blobId: string): Promise<string> {
        return Promise.reject("Invalid operation");
    }

    public uploadSummary(commit: api.ISummaryTree): Promise<api.ISummaryHandle> {
        return Promise.reject("Invalid operation");
    }

    public async getContent(version: api.IVersion, path: string): Promise<string> {
        return Promise.reject("Invalid operation");
    }

    public async write(tree: api.ITree, parents: string[], message: string): Promise<api.IVersion> {
        return Promise.reject("Invalid operation");
    }

    public async createBlob(file: Buffer): Promise<api.ICreateBlobResponse> {
        return Promise.reject("Invalid operation");
    }

    public downloadSummary(handle: api.ISummaryHandle): Promise<api.ISummaryTree> {
        return Promise.reject("Invalid operation");
    }

    public getRawUrl(blobId: string): string {
        throw new Error("Invalid operation");
    }
}