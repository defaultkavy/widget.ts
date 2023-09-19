export class Widget {
    constructor(options) {
        this.focusable = false;
        this.__onRemove__ = new Set;
        this.__listeners__ = new Map;
        this.hidden = false;
        this.element = document.createElement(options.tagName);
        this.id(options.id);
        this.element.$widget = this;
        if (options.class)
            this.class(...options.class);
    }
    id(id) {
        if (!arguments.length)
            return this.element.id;
        if (id === undefined)
            return this;
        this.element.id = id;
        return this;
    }
    class(...token) {
        if (!token.length)
            return this.element.classList;
        this.element.classList.add(...(token.map(t => t !== null && t !== void 0 ? t : '')));
        return this;
    }
    setAttribute(name, value) {
        this.element.setAttribute(name, value);
        return this;
    }
    unsetAttribute(name) {
        this.element.removeAttribute(name);
        return this;
    }
    unsetClass(...token) {
        if (!token.length)
            return this;
        this.element.classList.remove(...(token.map(t => t !== null && t !== void 0 ? t : '')));
        return this;
    }
    options(options) {
        this.id(options.id);
        if (options.class)
            this.class(...(options.class));
        if (options.css)
            this.css(options.css);
        return this;
    }
    css(options) {
        for (const string in options) {
            const value = options[string];
            if (typeof value === 'string')
                this.element.style[string] = value;
        }
        return this;
    }
    /**
     * **Remove this widget**.
     * @returns {this}
     */
    remove() {
        if (this.parent) {
            // Check parent widget children is not include this widget.
            if (this.parent.children.has(this))
                this.parent.children.delete(this);
        }
        this.element.remove();
        this.__event__('__onRemove__');
        return this;
    }
    hide() {
        this.hidden = true;
        if (this.parent)
            this.parent.children.build();
        return this;
    }
    show() {
        this.hidden = false;
        if (this.parent)
            this.parent.children.build();
        return this;
    }
    setListener(type, listener, options) {
        const fn = (e) => listener.bind(this, e, this)();
        this.__listeners__.set(listener, fn);
        this.element.addEventListener(type, fn);
        return this;
    }
    unsetListener(type, listener, options) {
        const fn = this.__listeners__.get(listener);
        if (!fn)
            return this;
        //@ts-expect-error
        this.element.removeEventListener(type, fn);
        return this;
    }
    /**
     * **Focus the element.**
     *
     * @returns {this}
     */
    focus() {
        this.element.focus();
        return this;
    }
    /**
     * **Remove focus of the element.**
     *
     * If {@link Widget.focusController} is undefiend, this method will normally remove focus of the element.
     * Otherwise, {@link FocusManager.blur()} will be avoked.
     * @returns {this}
     */
    blur() {
        this.element.blur();
        return this;
    }
    is(tagname) {
        return this.element.tagName === tagname.toUpperCase();
    }
    $this(fn) {
        if (fn)
            fn(this);
        return this;
    }
    execute() {
        this.element.click();
        return this;
    }
    isRendered() {
        const findDoc = (ele) => {
            if (ele.parentElement === document.body)
                return true;
            else {
                if (ele.parentElement)
                    return findDoc(ele.parentElement);
                return false;
            }
        };
        return findDoc(this.element);
    }
    onRemove(callback) {
        this.__onRemove__.add(() => callback(this));
        return this;
    }
    __event__(type) {
        this[type].forEach(fn => fn(this));
    }
    preventDefault() {
        return this;
    }
}
//# sourceMappingURL=Widget.js.map