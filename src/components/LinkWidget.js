import { __widget_shared__ } from "../index";
import { ParentWidget } from "./ParentWidget";
export class LinkWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'a' }));
        this.element = this.element;
        this.focusable = true;
        if (options) {
            if (options.url)
                this.element.href = options.url;
        }
        this.element.addEventListener('click', e => {
            if (!this.url())
                return;
            if (this.loadFn || __widget_shared__.linkFunction) {
                e.preventDefault();
                if (this.loadFn)
                    this.loadFn(this.element.href, e, this);
                else if (__widget_shared__.linkFunction)
                    __widget_shared__.linkFunction(this.url());
            }
        });
    }
    url(url, loadFn) {
        if (!arguments.length)
            return this.element.href;
        if (typeof url === 'string')
            this.element.href = url;
        this.loadFn = loadFn;
        return this;
    }
    preventDefault() {
        this.loadFn = undefined;
        return this;
    }
}
//# sourceMappingURL=LinkWidget.js.map