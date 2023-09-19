import { ParentWidget } from "./ParentWidget";
export class LabelWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'label' }));
        this.element = this.element;
    }
    for(str) {
        if (!arguments.length)
            return this.element.htmlFor;
        if (typeof str === 'string')
            this.element.htmlFor = str;
        return this;
    }
}
//# sourceMappingURL=LabelWidget.js.map