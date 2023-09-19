import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";
export declare class SpanWidget extends ParentWidget {
    readonly element: HTMLSpanElement;
    constructor(options?: SpanWidgetBuilderOptions);
}
export interface SpanWidgetBuilderOptions extends ParentWidgetOptions {
}
