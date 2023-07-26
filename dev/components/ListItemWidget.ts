import { WidgetManager } from "../structures/WidgetManager";
import { Content, Multable, Optional, ParentWidget, ParentWidgetOptions, WidgetContent } from "./ParentWidget";

export class ListItemWidget<C extends WidgetContent = WidgetContent> extends ParentWidget {
    constructor(options?: ListItemWidgetBuildOptions) {
        super({...options, tagName: 'li'})
        if (options) {
            if (options.value && this.element instanceof HTMLLIElement) this.element.value = options.value
        }
    }
    override readonly element: HTMLUListElement | HTMLOListElement | HTMLDListElement = this.element;
    children: WidgetManager<C> = this.children;
    item?: C;
    
    bind(item: C) {
        this.item = item;
        this.insert(item);
        return this;
    }

    content(): string;
    content(resolver: Multable<Optional<C>>): this;
    content(resolver?: Multable<Optional<C>>): string | this {
        if (!arguments.length) return super.content();
        return super.content(resolver)
    }

    insert(resolver: Multable<Optional<C>>, position?: number | undefined): this {
        super.insert(resolver, position);
        return this;
    }
}

export interface ListItemWidgetBuildOptions extends ListItemWidgetOptions {
    value?: number;
}

export interface ListItemWidgetOptions extends ParentWidgetOptions {
}