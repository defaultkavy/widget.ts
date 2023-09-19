import { WidgetManager } from "../structures/WidgetManager";
import { Multable, Optional, ParentWidget, ParentWidgetOptions, WidgetContent } from "./ParentWidget";
export declare class ListItemWidget<C extends WidgetContent = WidgetContent> extends ParentWidget {
    constructor(options?: ListItemWidgetBuildOptions);
    readonly element: HTMLUListElement | HTMLOListElement | HTMLDListElement;
    children: WidgetManager<C>;
    item?: C;
    bind(item: C): this;
    content(): string;
    content(resolver: Multable<Optional<C>>): this;
    insert(resolver: Multable<Optional<C>>, position?: number | undefined): this;
}
export interface ListItemWidgetBuildOptions extends ListItemWidgetOptions {
    value?: number;
}
export interface ListItemWidgetOptions extends ParentWidgetOptions {
}
