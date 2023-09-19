import { ParentWidget, ParentWidgetOptions } from "../../components/ParentWidget";
import { EventFunction } from "../../index";
import { PageWidget, PageInitFunction } from "./PageWidget";
import { NavigationDirection } from "./Router";
export declare class ViewWidget<P extends PageWidget = PageWidget> extends ParentWidget {
    constructor(path: string, options?: ViewWidgetOptions<P>);
    readonly routeInitMap: Map<string | RegExp, PageInitFunction<P>>;
    readonly routePageMap: Map<string, P>;
    readonly path: string;
    readonly currentPage?: P;
    readonly Page: new (...args: any[]) => any;
    private __transition_handler__?;
    private __process_fn_cache__;
    private _listeners;
    options(options?: ViewWidgetOptions<P>): this;
    route(path: string | RegExp, fn: PageInitFunction<P>): this;
    switch(path: string, navDir: NavigationDirection): any;
    $page(): P | undefined;
    $page(callback: PageProcessFunction<P>): this;
    on<K extends keyof ViewWidgetEvents<P>>(event: K, listener: EventFunction<ViewWidgetEvents<P>, K>): this;
    transitionHandler(): typeof this.__transition_handler__;
    transitionHandler(listener: typeof this.__transition_handler__): this;
    private transition;
    private __add__;
}
export interface ViewWidgetOptions<P> extends ParentWidgetOptions {
    page?: new (...args: any[]) => P;
}
type ViewWidgetEvents<P extends PageWidget> = {
    'switch': [oldPage: P | undefined, newPage: P, navDir: NavigationDirection];
    'create': [page: P];
};
export type PageProcessFunction<P extends PageWidget> = (page: P) => void;
export {};
