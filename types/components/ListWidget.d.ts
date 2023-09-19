import { WidgetManager } from "../structures/WidgetManager";
import { ListItemWidget } from "./ListItemWidget";
import { Complex, Multable, Optional, ParentWidget, ParentWidgetOptions, WidgetContent } from "./ParentWidget";
export declare class ListWidget<C extends WidgetContent = WidgetContent> extends ParentWidget {
    constructor(type: keyof ListWidgetTypeMap, options?: ListWidgetBuildOptions);
    readonly element: HTMLUListElement | HTMLOListElement | HTMLDListElement;
    listItems: WidgetManager<ListItemWidget<C>>;
    itemMap: Map<C, ListItemWidget<C>>;
    item(item: Multable<Optional<Complex<C>>>, position?: number): this;
    /**
     * Remove this widget. If specify resolver will remove the target item from list.
     * @param resolver Item or array of item. Leave blank to remove this widget.
     * @returns
     */
    remove(resolver?: Multable<Optional<C>>): this;
    sort(fn: (a: Optional<C>, b: Optional<C>) => number): this;
}
export interface ListWidgetBuildOptions extends ListWidgetOptions {
}
export interface ListWidgetOptions extends ParentWidgetOptions {
}
export interface ListWidgetTypeMap {
    'ol': ListWidget;
    'ul': ListWidget;
    'dl': ListWidget;
}
