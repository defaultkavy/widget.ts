import { WidgetManager } from "../structures/WidgetManager";
import { ParentWidget, ParentWidgetConfig, WidgetContent } from "./ParentWidget";

export class ListItemWidget<C extends WidgetContent> extends ParentWidget {
    constructor(options?: ListItemWidgetBuildOptions) {
        super({...options, tagName: 'li'})
        if (options) {
            if (options.value && this.dom instanceof HTMLLIElement) this.dom.value = options.value
        }
    }
    readonly dom = super.dom as HTMLUListElement | HTMLOListElement | HTMLDListElement;
    children = super.children as WidgetManager<C>;
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

export interface ListItemWidgetOptions extends ParentWidgetConfig {
}