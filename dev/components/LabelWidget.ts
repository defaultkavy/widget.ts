import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";

export class LabelWidget extends ParentWidget {
    override readonly element: HTMLLabelElement = this.element;
    constructor(options?: LabelWidgetBuildOptions) {
        super({...options, tagName: 'label'})
    }

    for(): string;
    for(str: string | undefined): this;
    for(str?: string | undefined): this | string {
        if (!arguments.length) return this.element.htmlFor;
        if (typeof str === 'string') this.element.htmlFor = str;
        return this;
    }
}

export interface LabelWidgetBuildOptions extends ParentWidgetOptions {}