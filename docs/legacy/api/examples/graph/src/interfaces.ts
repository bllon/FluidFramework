/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ISet } from "@prague/map";

/**
 * Collaborative graph interface
 */
export interface IGraph {

    getVertices(): ISet<any>;

    getEdges(): ISet<any>;

    addVertex(id: number, label: string);

    addEdge(nodeId1: number, nodeId2: number, label: string);
}

export interface IVertex {
    id: number;
    label: string;
}

export interface IEdge {
    nodeId1: number;
    nodeId2: number;
    label: string;
}