import { WidgetManager } from "../structures/WidgetManager";
import { InputWidget } from "./InputWidget";
import { Widget, WidgetBuildOptions, WidgetOptions } from "./Widget";
export declare class ParentWidget extends Widget {
    readonly element: HTMLElement;
    readonly children: WidgetManager<WidgetContent>;
    constructor(options: ParentWidgetBuildOptions);
    /**
     * Get widget text content.
     * @returns {string}
     */
    content(): string;
    /**
     * ### Replace content to parent widget
     * Set child node to this widget, child can be string, {@link Text} node, {@link Widget}.
     * @param resolver - string or {@link WidgetContent}, can be array.
     * @returns {this}
     */
    content(resolver: Complex<Multable<Optional<Content>>>): this;
    /**
     * ### Append child to parent
     * Adding child node to this widget, child can be string, {@link Text} node, {@link Widget}.
     * @param resolver - string or {@link WidgetContent}, can be array.
     * @returns {this}
     */
    insert(resolver: Complex<Multable<Optional<Content>>>, position?: number): this;
    /**
     * ### Remove child from parent
     * Remove child node from this parent widget, the parameter should be {@link Text} node or {@link Widget}.
     * @param resolver - {@link WidgetContent}, can be array.
     * @returns {this}
     */
    detach(resolver: Multable<Optional<WidgetContent>>): this;
    /**
     * ### Remove all children from parent.
     * This function is direct to {@link ParentWidget}.children.clear(), but will return this widget.
     * @returns {this}
     */
    clear(): this;
    options(options: ParentWidgetOptions): this;
    group(name: string, contents: Content[]): this;
    editable(): string;
    editable(value: boolean | 'plaintext-only'): this;
}
export interface ParentWidgetBuildOptions extends WidgetBuildOptions, ParentWidgetOptions {
}
export interface ParentWidgetOptions extends WidgetOptions {
    editable?: boolean;
}
export type WidgetContent = Widget | Text | HTMLElement;
export type BaseContent = string;
export type Content = BaseContent | WidgetContent | undefined;
export type Optional<C> = C | undefined;
export type Multable<C> = C | C[];
export type Complex<C> = C | Complex<C>[];
/**
 * Extension Widget for custom input type
 */
export declare abstract class ExtensionInputWidget extends ParentWidget {
    protected readonly hidden_input: InputWidget;
    constructor(options: ExtensionInputWidgetBuildOptions);
    value(): string;
    value(value?: string | undefined): this;
    name(): string;
    name(name: string): this;
    clear(force?: boolean): this;
}
export interface ExtensionInputWidgetBuildOptions extends ParentWidgetBuildOptions, ExtensionInputWidgetOptions {
}
export interface ExtensionInputWidgetOptions extends ParentWidgetOptions {
}
