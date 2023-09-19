import { ParentWidget } from "./ParentWidget";
/**
 * ### DIV
 * Represent DIV HTMLElement Widget object.
 * @param options - {@link DivisionWidgetBuildOptions}.
 * @extends ParentWidget
 */
export class DivisionWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'div' }));
        this.element = this.element;
    }
}
//# sourceMappingURL=DivisionWidget.js.map