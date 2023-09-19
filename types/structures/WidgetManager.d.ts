import { WidgetContent, ParentWidget } from "../components/ParentWidget";
/**
 * Multiple of {@link Widget}, {@link HTMLElement}, {@link Text} manager.
 *
 * *Generic parameter only accept Widget | Text | HTMLElement types,
 * using Exclude<T, BaseContent> to exclude 'string' and 'undefined' types in this parameter.*
 */
export declare class WidgetManager<T extends WidgetContent = WidgetContent> {
    protected cache: Set<T>;
    widget: ParentWidget;
    constructor(widget: ParentWidget);
    get array(): T[];
    get size(): number;
    /**
     *
     * Adding text - *convert string to {@link Text} element.*
     * @param {WidgetContent} resolver
     * @param {number} position
     * @returns
     */
    add(resolver: T | undefined, position?: number): this | undefined;
    insertToCache(resolver: T, position: number): void;
    delete(resolver: T | undefined): this;
    clear(): this;
    /**
     * Check target is child of parent.
     * @param node - Target widget or element
     * @param widgetScope - deep check every widget's nodeElement
     * @returns boolean
     */
    has(node: T, widgetScope?: boolean): boolean;
    include(node: T | undefined): boolean | undefined;
    build(): void;
    find(resolver: string): Element | null;
}
