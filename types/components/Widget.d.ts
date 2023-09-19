import { WidgetTagNameMap } from "../index";
import { ParentWidget } from "./ParentWidget";
export declare class Widget {
    readonly element: HTMLElement;
    readonly parent?: ParentWidget;
    readonly focusable: boolean;
    private readonly __onRemove__;
    private __listeners__;
    readonly hidden: boolean;
    constructor(options: WidgetBuildOptions);
    id(): string;
    id(id: string | undefined): this;
    class(): DOMTokenList;
    class(...token: (string | undefined)[]): this;
    setAttribute(name: string, value: string): this;
    unsetAttribute(name: string): this;
    unsetClass(...token: (string | undefined)[]): this;
    options(options: WidgetOptions): this;
    css(options: CSSOptions): this;
    /**
     * **Remove this widget**.
     * @returns {this}
     */
    remove(): this;
    hide(): this;
    show(): this;
    setListener<K extends keyof HTMLElementEventMap>(type: K, listener: ListenerFunction<HTMLElementEventMap, K, this>, options?: boolean | AddEventListenerOptions): this;
    unsetListener<K extends keyof HTMLElementEventMap>(type: K, listener: ListenerFunction<HTMLElementEventMap, K, this>, options?: boolean | AddEventListenerOptions): this;
    /**
     * **Focus the element.**
     *
     * @returns {this}
     */
    focus(): this;
    /**
     * **Remove focus of the element.**
     *
     * If {@link Widget.focusController} is undefiend, this method will normally remove focus of the element.
     * Otherwise, {@link FocusManager.blur()} will be avoked.
     * @returns {this}
     */
    blur(): this;
    is<T extends keyof WidgetTagNameMap>(tagname: T): this is WidgetTagNameMap[T];
    $this(fn?: (widget: this) => void): this;
    execute(): this;
    isRendered(): boolean;
    onRemove(callback: (widget: this) => void): this;
    private __event__;
    preventDefault(): this;
}
export interface WidgetBuildOptions extends WidgetDomBuildOptions, WidgetOptions {
}
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
export type ListenerFunction<M extends {
    [key: string]: any;
}, K extends keyof M, W extends Widget> = (this: W, ev: M[K], widget: W) => any;
type Arguments = {
    [key: string]: any[];
};
export type EventFunction<T extends Arguments, K extends keyof T> = (...args: T[K]) => void;
export {};
