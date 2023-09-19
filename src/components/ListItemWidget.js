import { ParentWidget } from "./ParentWidget";
export class ListItemWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'li' }));
        this.element = this.element;
        this.children = this.children;
        if (options) {
            if (options.value && this.element instanceof HTMLLIElement)
                this.element.value = options.value;
        }
    }
    bind(item) {
        this.item = item;
        this.insert(item);
        return this;
    }
    content(resolver) {
        if (!arguments.length)
            return super.content();
        return super.content(resolver);
    }
    insert(resolver, position) {
        super.insert(resolver, position);
        return this;
    }
}
//# sourceMappingURL=ListItemWidget.js.map