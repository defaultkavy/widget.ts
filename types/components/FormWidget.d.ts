import { Optional, ParentWidget, ParentWidgetOptions } from "./ParentWidget";
export declare class FormWidget extends ParentWidget {
    readonly element: HTMLFormElement;
    constructor(options?: FormWidgetBuildOptions);
    action(url: string): this;
    method(method: 'GET' | 'POST'): this;
    options(options: FormWidgetBuildOptions): this;
    autocomplete(): boolean;
    autocomplete(enable: Optional<boolean>): this;
}
export interface FormWidgetBuildOptions extends ParentWidgetOptions {
    action?: string;
}
