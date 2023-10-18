import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

/**
 * ### DIV
 * Represent DIV HTMLElement Widget object.
 * @param options - {@link DivisionWidgetBuildOptions}.
 * @extends ParentWidget
 */
export class DivisionWidget extends ParentWidget {
    readonly dom = super.dom as HTMLDivElement;
    constructor(options?: DivisionWidgetBuildOptions) {
        super({...options, tagName: 'div'})
    }
}

export interface DivisionWidgetBuildOptions extends ParentWidgetConfig {

}