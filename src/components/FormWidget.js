import { ParentWidget } from "./ParentWidget";
export class FormWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'form' }));
        this.element = this.element;
    }
    action(url) {
        this.element.action = url;
        return this;
    }
    method(method) {
        this.element.method = method;
        return this;
    }
    options(options) {
        super.options(options);
        if (options.action)
            this.action(options.action);
        return this;
    }
    autocomplete(enable) {
        if (!arguments.length)
            return this.element.autocomplete === 'on' ? true : false;
        if (typeof enable === 'boolean')
            this.element.autocomplete = enable ? 'on' : 'off';
        return this;
    }
}
//# sourceMappingURL=FormWidget.js.map