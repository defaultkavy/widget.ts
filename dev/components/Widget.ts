import { $w, WidgetTagNameMap, WidgetUtil, __widget_shared__ } from "../index";
import { ParentWidget } from "./ParentWidget";

export class Widget<H extends HTMLElement = HTMLElement> {
    readonly dom: H;
    readonly parent?: ParentWidget<HTMLElement>;
    readonly focusable: boolean = false;
    private readonly __onRemove__: Set<(widget: Widget) => void> = new Set;
    private __listeners__: Map<Function, Function> = new Map;
    readonly hidden: boolean = false;
    constructor(config: WidgetBuildConfig) {
        this.dom = document.createElement(config.tagName) as H;
        this.id(config.id);
        this.dom.$widget = this;
        if (config.class) this.class(...config.class);
        // WidgetUtil.autobind(this);
    }

    id(): string;
    id(id: string | undefined): this;
    id(id?: string | undefined): this | string {
        if (!arguments.length) return this.dom.id;
        if (id === undefined) return this;
        this.dom.id = id;
        return this;
    }

    class(): DOMTokenList;
    class(...token: (string | undefined)[]): this;
    class(...token: (string | undefined)[]): this | DOMTokenList {
        if (!token.length) return this.dom.classList;
        this.dom.classList.add(...(token.map(t => t ?? '')));
        return this;
    }

    dataset(): DOMStringMap;
    dataset(key: string): string | undefined;
    dataset(key: string, value: string | undefined): this;
    dataset(key?: string, value?: string | undefined) {
        if (arguments.length === 0) return this.dom.dataset;
        if (key) {
            if (arguments.length === 1) return this.dom.dataset[key];
            this.dom.dataset[key] = value;
        }
        return this;
    }

    setAttribute(name: string, value: string) {
        this.dom.setAttribute(name, value)
        return this;
    }

    unsetAttribute(name: string) {
        this.dom.removeAttribute(name)
        return this;
    }

    unsetClass(...token: (string | undefined)[]) {
        if (!token.length) return this;
        this.dom.classList.remove(...(token.map(t => t ?? '')));
        return this;
    }

    config(options: WidgetConfig): this {
        this.id(options.id);
        if (options.class) this.class(...(options.class));
        if (options.css) this.css(options.css);
        return this;
    }

    css(options: CSSOptions) {
        for (const string in options) {
            const value = options[string]
            if (typeof value === 'string') this.dom.style[string] = value;
        }
        return this;
    }

    animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | AnimationOptions): Animation {
        const animation = this.dom.animate(keyframes, options);
        if (typeof options !== "number") {
            if (options?.commitOnfinish) {
                animation.addEventListener('finish', (e) => {
                    animation.commitStyles();
                    animation.cancel();
                })
            }
            if (options?.finish) animation.addEventListener('finish', (e) => options.finish!(animation, e));
            if (options?.cancel) animation.addEventListener('cancel', (e) => options.cancel!(animation, e));
            if (options?.remove) animation.addEventListener('remove', (e) => options.remove!(animation, e));
        }
        return animation;
    }

    /**
     * **Remove this widget**.
     * @returns {this}
     */
    remove(): this {
        if (this.parent) {
            // Check parent widget children is not include this widget.
            if (this.parent.children.inCache(this)) this.parent.children.delete(this);
        }
        this.dom.remove();
        this.__event__('__onRemove__');
        return this;
    }

    hide(reflow: boolean = true) {
        (<Mutable<Widget>>this).hidden = true;
        if (reflow && this.parent) this.parent.children.build();
        return this;
    }

    show(reflow: boolean = true) {
        (<Mutable<Widget>>this).hidden = false;
        if (reflow && this.parent) this.parent.children.build();
        return this;
    }

    setListener<K extends keyof HTMLElementEventMap>(type: K, listener: ListenerFunction<HTMLElementEventMap, K, this>, options?: boolean | AddEventListenerOptions): this {
        const fn = (e: HTMLElementEventMap[K]) => listener.bind(this, e, this)()
        this.__listeners__.set(listener, fn);
        this.dom.addEventListener(type, fn);
        return this;
    }

    unsetListener<K extends keyof HTMLElementEventMap>(type: K, listener: ListenerFunction<HTMLElementEventMap, K, this>, options?: boolean | AddEventListenerOptions): this {
        const fn = this.__listeners__.get(listener);
        if (!fn) return this;
        //@ts-expect-error
        this.dom.removeEventListener(type, fn);
        return this;
    }

    /**
     * **Focus the element.**
     * 
     * @returns {this}
     */
    focus(): this {
        this.dom.focus();
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
        this.dom.blur();
        return this;
    }

    is<T extends keyof WidgetTagNameMap>(tagname: T): this is WidgetTagNameMap[T] {
        return this.dom.tagName === tagname.toUpperCase();
    }

    $this(fn?: (widget: this) => void) {
        if (fn) fn(this);
        return this;
    }

    execute() {
        this.dom.click();
        return this;
    }

    isRendered() {
        return Widget.isRendered(this.dom);
    }

    static isRendered(ele: Widget | Node | undefined): boolean | undefined {
        if (!ele) return undefined;
        ele = $w.dom(ele);
        return document.body.contains(ele)
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

    rect(relative?: Widget): DOMRect {
        if (!relative) return this.dom.getBoundingClientRect();
        else {
            const dom_rect = this.dom.getBoundingClientRect();
            const re_rect = relative.dom.getBoundingClientRect();
            const domRect = {
                left: dom_rect.left - re_rect.left,
                top: dom_rect.top - re_rect.top,
                bottom: dom_rect.bottom - re_rect.bottom,
                right: dom_rect.right - re_rect.right,
                x: dom_rect.x - re_rect.x,
                y: dom_rect.y - re_rect.y,
                height: re_rect.height,
                width: re_rect.width,
            }
            return {
                ...domRect,
                toJSON: () => domRect
            }
        }
    }
}

export interface WidgetBuildConfig extends WidgetDomBuildConfig, WidgetConfig {}

export interface WidgetDomBuildConfig {
    tagName: string;
}

export interface WidgetConfig {
    id?: string;
    class?: string[];
    css?: CSSOptions;
}

export type CSSOptions = {
    [key in keyof CSSStyleDeclaration]?: string | null;
};

export type ListenerFunction<M extends {[key: string]: any}, K extends keyof M, W extends Widget> = (this: W, ev: M[K], widget: W) => any;


export type Arguments = {
    [key: string]: any[]
}
export type EventFunction<T extends Arguments, K extends keyof T> = (...args: T[K]) => void;

export interface AnimationOptions extends KeyframeAnimationOptions {
    finish?: (animation: Animation, event: AnimationPlaybackEvent) => void;
    cancel?: (animation: Animation, event: AnimationPlaybackEvent) => void;
    remove?: (animation: Animation, event: Event) => void;
    /**
     * Auto commit forward or backward style and cancel animation when finish. Default value is false
     */
    commitOnfinish?: boolean;
}