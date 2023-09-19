import { ParentWidget } from "./ParentWidget";
export class SpanWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'span' }));
        this.element = this.element;
    }
}
//# sourceMappingURL=SpanWidget.js.map