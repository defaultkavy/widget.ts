import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class LabelWidget extends ParentWidget {
    readonly dom = super.dom as HTMLLabelElement;
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

export interface LabelWidgetBuildOptions extends ParentWidgetConfig {}