import { ParentWidget } from "./ParentWidget";
/**
 * ### Text Element Builder
 * Class representing a text element.
 * @param options - {@link TextWidgetBuildOptions}.
 * @class
 */
export class TextWidget extends ParentWidget {
    constructor(type, options) {
        super(Object.assign(Object.assign({}, options), { tagName: type }));
        this.element = this.element;
        this.type = type;
    }
}
//# sourceMappingURL=TextWidget.js.map