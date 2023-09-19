import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";
export declare class ButtonWidget extends ParentWidget {
    readonly element: HTMLButtonElement;
    constructor(options?: ButtonWidgetBuildOptions);
    options(options: ButtonWidgetBuildOptions): this;
}
export interface ButtonWidgetBuildOptions extends ParentWidgetOptions {
    url?: string;
}
