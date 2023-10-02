import { Widget } from "../index";
import { WidgetManager } from "../structures/WidgetManager";
import { ListItemWidget } from "./ListItemWidget";
import { Complex, Multable, Optional, ParentWidget, ParentWidgetOptions, WidgetContent } from "./ParentWidget";

export class ListWidget<C extends WidgetContent> extends ParentWidget {
    constructor(type: keyof ListWidgetTypeMap, options?: ListWidgetBuildOptions) {
        super({
            ...options,
            tagName: type
        })
    }
    override readonly dom: HTMLUListElement | HTMLOListElement | HTMLDListElement = this.dom;
    items = new WidgetManager<ListItemWidget<C>>(this);
    itemMap = new Map<C, ListItemWidget<C>>;

    item(item: Multable<Optional<Complex<C>>>, position?: number) {
        if (item instanceof Array) item.forEach(i => this.item(i))
        else {
            if (item === undefined) return this;
            const LIST_ITEM = this.itemMap.get(item) ?? new ListItemWidget<C>().bind(item);
            this.itemMap.set(item, LIST_ITEM);
            this.items.add(LIST_ITEM, position);
            this.insert(LIST_ITEM, position);
        }
        return this;
    }

    /**
     * Remove this widget. If specify resolver will remove the target item from list.
     * @param resolver Item or array of item. Leave blank to remove this widget.
     * @returns 
     */
    remove(resolver?: Multable<Optional<C | ListItemWidget<C>>>) {
        if (!arguments.length) return super.remove();
        if (resolver instanceof Array) resolver.forEach(item => this.remove(item))
        else if (resolver !== undefined) {
            if (resolver instanceof ListItemWidget) {
                this.itemMap.delete(resolver.item)
                this.items.delete(resolver);
            }
            else {
                const $item = this.itemMap.get(resolver);
                this.items.delete($item)
                this.itemMap.delete(resolver);
            }
        }
        return this;
    }

    clear(): this {
        this.itemMap.forEach(item => this.remove(item))
        super.clear();
        return this;
    }

    sort(fn: (a: C, b: C) => number) {
        function filterUndefined(array: Optional<C>[]): C[] {
            return array.filter(value => value !== undefined) as C[]
        }
        const ITEM_LIST = filterUndefined(this.items.array.map(item => item.item));
        ITEM_LIST.sort(fn).forEach(item => this.item(item));
        return this;
    }
}

export interface ListWidgetBuildOptions extends ListWidgetOptions {
}

export interface ListWidgetOptions extends ParentWidgetOptions {
}

export interface ListWidgetTypeMap {
    'ol': ListWidget<WidgetContent>;
    'ul': ListWidget<WidgetContent>;
    'dl': ListWidget<WidgetContent>;
}