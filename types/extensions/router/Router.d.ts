import { PageInitFunction, PageWidget } from "./PageWidget";
import { ViewWidget } from "./ViewWidget";
export declare class Router {
    views: Map<string, ViewWidget>;
    currentView?: ViewWidget;
    pageIndex: number;
    private notFoundFn?;
    prevURL?: string;
    constructor();
    open(url?: string): void;
    back(replace_url?: string): void;
    replace(url: string): void;
    assign(view: ViewWidget<any>): void;
    listen(): void;
    private pathChange;
    private hashChange;
    private execute;
    notFound(fn: PageInitFunction<PageWidget>): this;
    private onNotFound;
}
export type NavigationDirection = 'FORWARD' | 'BACK' | 'REPLACE';
export declare const $r: Router;
