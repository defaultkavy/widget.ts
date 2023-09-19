import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";
export declare class LinkWidget extends ParentWidget {
    readonly element: HTMLAnchorElement;
    loadFn?: (url: string, e: Event, w: this) => void;
    readonly focusable = true;
    constructor(options?: LinkWidgetBuildOptions);
    url(): string;
    url(url?: string, loadFn?: (url: string, e: Event, w: this) => void): this;
    preventDefault(): this;
}
export interface LinkWidgetBuildOptions extends ParentWidgetOptions {
    url?: string;
}
