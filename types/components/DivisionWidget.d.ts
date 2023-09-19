import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";
/**
 * ### DIV
 * Represent DIV HTMLElement Widget object.
 * @param options - {@link DivisionWidgetBuildOptions}.
 * @extends ParentWidget
 */
export declare class DivisionWidget extends ParentWidget {
    readonly element: HTMLDivElement;
    constructor(options?: DivisionWidgetBuildOptions);
}
export interface DivisionWidgetBuildOptions extends ParentWidgetOptions {
}
