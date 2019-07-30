/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
  PrimedComponent,
  SimpleComponentInstantiationFactory,
} from "@prague/aqueduct";
import {
  IComponentHTMLVisual,
} from "@prague/container-definitions";
import {
  Counter,
  CounterValueType,
  SharedMap,
} from "@prague/map";
import {
  IComponentContext,
  IComponentRuntime,
} from "@prague/runtime-definitions";

/**
 * Clicker example using view interfaces and stock component classes.
 */
export class Clicker extends PrimedComponent implements IComponentHTMLVisual {
  private static readonly supportedInterfaces = ["IComponentHTMLVisual", "IComponentHTMLRender"];

    /**
   * Create is where you do setup for your component. This is only called once the first time your component 
   * is created. Anything that happens in create will happen before any other user will see the component.
   */
  protected async create() {
    // Calling super.create() creates a root SharedMap that you can work off.
    await super.create();
    this.root.set("clicks", 0, CounterValueType.Name);

    // Uncomment the line below to add a title to your data schema!
    /*
    this.root.set("title", "Initial Title Value");
    */
  }

  /**
   * Static load function that allows us to make async calls while creating our object.
   * This becomes the standard practice for creating components in the new world.
   * Using a static allows us to have async calls in class creation that you can't have in a constructor
   */
  public static async load(runtime: IComponentRuntime, context: IComponentContext): Promise<Clicker> {
    const clicker = new Clicker(runtime, context, Clicker.supportedInterfaces);
    await clicker.initialize();

    return clicker;
  }

  /**
   * Will return a new Clicker view
   */
  public render(div: HTMLElement) {
    const counter = this.root.get<Counter>("clicks");

    // Do initial setup off the provided div.
    this.createComponentDom(div);

    // When the value of the counter is incremented we will reRender the 
    // value in the counter span
    counter.on("incremented", () => {
      // Uncomment the block below to live update your title
      /*
      const title = this.root.get("title");
      const titleParagraph = document.getElementById("titleParagraph");
      titleParagraph.textContent = title;
      */

     const counterSpan = document.getElementById("counterSpan");
     counterSpan.textContent = counter.value.toString();
    });
  }

  private createComponentDom(host: HTMLElement) {

    const counter = this.root.get<Counter>("clicks");

    // Uncomment the block below to create a title in your components DOM
    /*
    const titleParagraph = document.createElement("p");
    titleParagraph.id = "titleParagraph";
    host.appendChild(titleParagraph);

    const titleInput = document.createElement("input");
    titleInput.id = "titleInput";
    titleInput.type = "text";
    titleInput.oninput = ( e) => { this.root.set("title", (e.target as any).value) };
    host.appendChild(titleInput);
    */

    const counterSpan = document.createElement("span");
    counterSpan.id = "counterSpan";
    counterSpan.textContent = counter.value.toString();
    host.appendChild(counterSpan);

    const counterButton = document.createElement("button");
    counterButton.id = "counterButton";
    counterButton.textContent = "+";
    counterButton.onclick = () => counter.increment(1);
    host.appendChild(counterButton);
  }
}

/**
 * This is where you define all your Distributed Data Structures
 */
export const ClickerInstantiationFactory = new SimpleComponentInstantiationFactory(
  [
    SharedMap.getFactory([new CounterValueType()]),
  ],
  Clicker.load
);