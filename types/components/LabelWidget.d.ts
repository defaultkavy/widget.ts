import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";
export declare class LabelWidget extends ParentWidget {
    readonly element: HTMLLabelElement;
    constructor(options?: LabelWidgetBuildOptions);
    for(): string;
    for(str: string | undefined): this;
}
export interface LabelWidgetBuildOptions extends ParentWidgetOptions {
}
