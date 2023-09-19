import { ParentWidget } from "./ParentWidget";
export class ButtonWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'button' }));
        this.element = this.element;
    }
    options(options) {
        super.options(options);
        return this;
    }
}
//# sourceMappingURL=ButtonWidget.js.map