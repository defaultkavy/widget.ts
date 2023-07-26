import { WidgetManager } from "../structures/WidgetManager";
import { ListItemWidget } from "./ListItemWidget";
import { Complex, Multable, Optional, ParentWidget, ParentWidgetOptions, WidgetContent } from "./ParentWidget";

export class ListWidget<C extends WidgetContent = WidgetContent> extends ParentWidget {
    constructor(type: keyof ListWidgetTypeMap, options?: ListWidgetBuildOptions) {
        super({
            ...options,
            tagName: type
        })
    }
    override readonly element: HTMLUListElement | HTMLOListElement | HTMLDListElement = this.element;
    listItems = new WidgetManager<ListItemWidget<C>>(this);
    itemMap = new Map<C, ListItemWidget<C>>;

    item(item: Multable<Optional<Complex<C>>>, position?: number) {
        if (item instanceof Array) item.forEach(i => this.item(i))
        else {
            if (item === undefined) return this;
            const LIST_ITEM = this.itemMap.get(item) ?? new ListItemWidget<C>().bind(item);
            this.itemMap.set(item, LIST_ITEM);
            this.listItems.add(LIST_ITEM, position);
            this.insert(LIST_ITEM, position);
        }
        return this;
    }

    /**
     * Remove this widget. If specify resolver will remove the target item from list.
     * @param resolver Item or array of item. Leave blank to remove this widget.
     * @returns 
     */
    remove(resolver?: Multable<Optional<C>>) {
        if (!arguments.length) return super.remove();
        if (resolver instanceof Array) resolver.forEach(item => this.remove(item))
        else if (resolver !== undefined) this.listItems.delete(this.itemMap.get(resolver));
        return this;
    }

    sort(fn: (a: Optional<C>, b: Optional<C>) => number) {
        const ITEM_LIST = this.listItems.array.map(item => item.item);
        ITEM_LIST.sort(fn).forEach(item => this.item(item));
        return this;
    }
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