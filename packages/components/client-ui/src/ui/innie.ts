/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Block, BoxState } from "@prague/app-ui";
import { Document } from "@prague/client-api";
import { IComponent, IComponentHTMLViewable } from "@prague/container-definitions";
import { parse } from "url";
import { debug } from "./debug";
import { FlowViewContext } from "./flowViewContext";

const platformSym = Symbol("Document.platform");

class Host implements IComponent {
    constructor() {
    }

    public query<T>(id: string): T {
        return undefined;
    }

    public list(): string[] {
        return [];
    }
}

export class InnerDocumentState extends BoxState {
    public id: string;
}

export class InnerComponent extends Block<InnerDocumentState> {
    // TODO taking a dependency on the loader, loader-web, and socket-storage is not something we want to do.
    // This component needs access to the core abstract loader defined in runtime-definitions
    // but we need to update the API to provide it access and include the necessary methods.
    // We cut some corners below to start experimenting with dynamic document loading.
    protected mounting(self: InnerDocumentState, context: FlowViewContext): HTMLElement {
        console.log(`Mount value is ${self.id}`);

        // Create the div to which the Chart will attach the SVG rendered chart when the
        // web service responds.
        const div = document.createElement("div");
        div.style.width = "400px";
        div.style.height = "600px";

        const parsedHref = parse(window.location.href);
        const openUrl = `${parsedHref.pathname}/${self.id}`;

        const openDoc = document.createElement("a");
        openDoc.href = openUrl;
        openDoc.target = "_blank";
        openDoc.innerText = openUrl;
        openDoc.style.display = "block";
        openDoc.style.width = "100%";
        openDoc.classList.add("component-link");

        const mountDiv = document.createElement("div");
        mountDiv.classList.add("mount-point");
        mountDiv.style.flexWrap = "wrap";
        mountDiv.appendChild(openDoc);
        mountDiv.appendChild(div);

        // This is my access to the document
        const collabDocument = context.services.get("document") as Document;

        // const invalidateLayout = (width: number, height: number) => {
        //     div.style.width = `${width}px`;
        //     div.style.height = `${height}px`;
        //     context.services.get("invalidateLayout")();
        // };

        const attachedP = collabDocument.context.hostRuntime.request({ url: `/${self.id}`}).then(async (response) => {
            if (response.status !== 200 || response.mimeType !== "prague/component") {
                return Promise.reject(response);
            }

            const component = response.value as IComponent;
            const viewable = await component.query<IComponentHTMLViewable>("IComponentHTMLViewable");
            if (!viewable) {
                return;
            }

            // Attach our div to the host
            const host = new Host();
            viewable.addView(host, div);

            // TODO bring d.ts back
            // definitionGuide.addComponent(component.id, innerPlatform);
        });

        attachedP.catch((error) => {
            debug(`Attachment error`, error);
        });

        // Call 'updating' to update the contents of the div with the updated chart.
        return this.updating(self, context, mountDiv);
    }

    protected unmounting(self: BoxState, context: FlowViewContext, element: HTMLElement): void {
        // NYI: FlowView currently does not unmount components as they are removed.
    }

    protected updating(self: InnerDocumentState, context: FlowViewContext, element: HTMLElement): HTMLElement {
        if (self[platformSym]) {
            self[platformSym].update();
        }

        return element;
    }
}