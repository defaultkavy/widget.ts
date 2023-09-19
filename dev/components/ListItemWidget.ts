import { WidgetManager } from "../structures/WidgetManager";
import { ParentWidget, ParentWidgetOptions, WidgetContent } from "./ParentWidget";

export class ListItemWidget<C extends WidgetContent = WidgetContent> extends ParentWidget {
    constructor(options?: ListItemWidgetBuildOptions) {
        super({...options, tagName: 'li'})
        if (options) {
            if (options.value && this.dom instanceof HTMLLIElement) this.dom.value = options.value
        }
    }
    override readonly dom: HTMLUListElement | HTMLOListElement | HTMLDListElement = this.dom;
    children: WidgetManager<C> = this.children;
    item?: C;
    
    bind(item: C) {
        this.item = item;
        this.insert(item);
        return this;
    }
}

export interface ListItemWidgetBuildOptions extends ListItemWidgetOptions {
    value?: number;
}

export interface ListItemWidgetOptions extends ParentWidgetOptions {
}