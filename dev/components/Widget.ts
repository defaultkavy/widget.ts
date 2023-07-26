import { Mutable } from "../global";
import { WidgetTagNameMap, __widget_shared__ } from "../index";
import { ParentWidget } from "./ParentWidget";

export class Widget {
    readonly element: HTMLElement;
    readonly parent?: ParentWidget;
    readonly focusable: boolean = false;
    private readonly __onRemove__: Set<(widget: Widget) => void> = new Set;
    private __listeners__: Map<Function, Function> = new Map;
    readonly hidden: boolean = false;
    constructor(options: WidgetBuildOptions) {
        this.element = document.createElement(options.tagName);
        this.id(options.id);
        this.element.$widget = this;
        if (options.class) this.class(...options.class);
    }

    id(): string;
    id(id: string | undefined): this;
    id(id?: string | undefined): this | string {
        if (!arguments.length) return this.element.id;
        if (id === undefined) return this;
        this.element.id = id;
        return this;
    }

    class(): DOMTokenList;
    class(...token: (string | undefined)[]): this;
    class(...token: (string | undefined)[]): this | DOMTokenList {
        if (!token.length) return this.element.classList;
        this.element.classList.add(...(token.map(t => t ?? '')));
        return this;
    }

    setAttribute(name: string, value: string) {
        this.element.setAttribute(name, value)
        return this;
    }

    unsetAttribute(name: string) {
        this.element.removeAttribute(name)
        return this;
    }

    unsetClass(...token: (string | undefined)[]) {
        if (!token.length) return this;
        this.element.classList.remove(...(token.map(t => t ?? '')));
        return this;
    }

    options(options: WidgetOptions): this {
        this.id(options.id);
        if (options.class) this.class(...(options.class));
        if (options.css) this.css(options.css);
        return this;
    }

    css(options: CSSOptions) {
        for (const string in options) {
            const value = options[string]
            if (typeof value === 'string') this.element.style[string] = value;
        }
        return this;
    }

    /**
     * **Remove this widget**.
     * @returns {this}
     */
    remove(): this {
        if (this.parent) {
            // Check parent widget children is not include this widget.
            if (this.parent.children.has(this)) this.parent.children.delete(this);
        }
        this.element.remove();
        this.__event__('__onRemove__');
        return this;
    }

    hide() {
        (<Mutable<Widget>>this).hidden = true;
        if (this.parent) this.parent.children.build();
        return this;
    }

    show() {
        (<Mutable<Widget>>this).hidden = false;
        if (this.parent) this.parent.children.build();
        return this;
    }

    setListener<K extends keyof HTMLElementEventMap>(type: K, listener: ListenerFunction<HTMLElementEventMap, K, this>, options?: boolean | AddEventListenerOptions): this {
        const fn = (e: HTMLElementEventMap[K]) => listener.bind(this, e, this)()
        this.__listeners__.set(listener, fn);
        this.element.addEventListener(type, fn);
        return this;
    }

    removeListener<K extends keyof HTMLElementEventMap>(type: K, listener: ListenerFunction<HTMLElementEventMap, K, this>, options?: boolean | AddEventListenerOptions): this {
        const fn = this.__listeners__.get(listener);
        if (!fn) return this;
        //@ts-expect-error
        this.element.removeEventListener(type, fn);
        return this;
    }

    /**
     * **Focus the element.**
     * 
     * @returns {this}
     */
    focus(): this {
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

    blur(): this {
        this.element.blur();
        return this;
    }

    is<T extends keyof WidgetTagNameMap>(tagname: T): this is WidgetTagNameMap[T] {
        return this.element.tagName === tagname.toUpperCase();
    }

    $this(fn?: (widget: this) => void) {
        if (fn) fn(this);
        return this;
    }

    execute() {
        this.element.click();
        return this;
    }

    isRendered() {
        const findDoc: (ele: HTMLElement) => boolean = (ele: HTMLElement) => {
            if (ele.parentElement === document.body) return true;
            else {
                if (ele.parentElement) return findDoc(ele.parentElement);
                return false;
            }
        }

        return findDoc(this.element);
    }

    onRemove(callback: (widget: this) => void) {
        this.__onRemove__.add(() => callback(this));
        return this;
    }

    private __event__(type: '__onRemove__') {
        this[type].forEach(fn => fn(this))
    }

    preventDefault() {
        return this;
    }
}

export interface WidgetBuildOptions extends WidgetDomBuildOptions, WidgetOptions {}

export interface WidgetDomBuildOptions {
    tagName: string;
}

export interface WidgetOptions {
    id?: string;
    class?: string[];
    css?: CSSOptions;
}

export type CSSOptions = {
    [key in keyof CSSStyleDeclaration]?: string | null;
};

export type ListenerFunction<M extends {[key: string]: any}, K extends keyof M, W extends Widget> = (this: W, ev: M[K], widget: W) => any;


type Arguments = {
    [key: string]: any[]
}
export type EventFunction<T extends Arguments, K extends keyof T> = (...args: T[K]) => void;