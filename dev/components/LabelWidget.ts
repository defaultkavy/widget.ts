import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";

export class LabelWidget extends ParentWidget {
    override readonly dom: HTMLLabelElement = this.dom;
    constructor(options?: LabelWidgetBuildOptions) {
        super({...options, tagName: 'label'})
    }

    for(): string;
    for(str: string | undefined): this;
    for(str?: string | undefined): this | string {
        if (!arguments.length) return this.dom.htmlFor;
        if (typeof str === 'string') this.dom.htmlFor = str;
        return this;
    }
}

export interface LabelWidgetBuildOptions extends ParentWidgetOptions {}