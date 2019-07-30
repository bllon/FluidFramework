/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    SimpleComponentInstantiationFactory,
} from "@prague/aqueduct";
import {
    SharedCell,
} from "@prague/cell";
import {
    CounterValueType,
    SharedMap,
} from "@prague/map";
import { IComponentFactory } from "@prague/runtime-definitions";
import {
    SharedString,
} from "@prague/sequence";

import { Todo } from "./index";

export const TodoInstantiationFactory: IComponentFactory = new SimpleComponentInstantiationFactory(
    [
        SharedMap.getFactory([new CounterValueType()]),
        SharedString.getFactory(),
        SharedCell.getFactory(),
    ],
    Todo.load,
);