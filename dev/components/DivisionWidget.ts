import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";

/**
 * ### DIV
 * Represent DIV HTMLElement Widget object.
 * @param options - {@link DivisionWidgetBuildOptions}.
 * @extends ParentWidget
 */
export class DivisionWidget extends ParentWidget {
    override readonly dom: HTMLDivElement = this.dom;
    constructor(options?: DivisionWidgetBuildOptions) {
        super({...options, tagName: 'div'})
    }
}

export interface DivisionWidgetBuildOptions extends ParentWidgetOptions {

}