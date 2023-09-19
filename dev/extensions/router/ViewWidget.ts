import { ParentWidget, ParentWidgetOptions } from "../../components/ParentWidget";
import { Mutable } from "../../global";
import { EventFunction } from "../../index";
import { PageWidget, PageInitFunction, PageWidgetOptions } from "./PageWidget";
import { NavigationDirection, $r } from "./Router";

export class ViewWidget<P extends PageWidget = PageWidget> extends ParentWidget {
    constructor(path: string, options?: ViewWidgetOptions<P>) {
        super({
            ...options,
            tagName: 'view'
        });
        this.path = path;
        this.options(options);
        $r.assign(this);
    }
    readonly routeInitMap: Map<string | RegExp | RouteFunction, PageWidgetOptions<P>> = new Map;
    readonly routePageMap: Map<string, P> = new Map;
    readonly path: string;
    readonly currentPage?: P;
    readonly Page: new (...args: any[]) => any = PageWidget;
    titleStyle?: TitleStyle;
    private __transition_handler__?: (oldPage: P | undefined, newPage: P, navDir: NavigationDirection) => void;
    private __process_fn_cache__: Set<PageProcessFunction<P>> = new Set;
    private _listeners = {
        switch: new Set as Set<EventFunction<ViewWidgetEvents<P>, 'switch'>>,
        create: new Set as Set<EventFunction<ViewWidgetEvents<P>, 'create'>>,
    };

    options(options?: ViewWidgetOptions<P>): this {
        if (options === undefined) return this;
        super.options(options);
        if (options.page) (<Mutable<ViewWidget<P>>>this).Page = options.page;
        if (options.titleStyle) this.titleStyle = options.titleStyle;
        return this
    }

    route(path: string | RegExp | RouteFunction, fn:  PageInitFunction<P>): this;
    route(path: string | RegExp | RouteFunction, options:  PageWidgetOptions<P>): this;
    route(path: string | RegExp | RouteFunction, resovler: PageWidgetOptions<P> | PageInitFunction<P>): this {
        if (resovler instanceof Function) this.routeInitMap.set(path, {init: resovler as PageInitFunction<PageWidget>});
        else this.routeInitMap.set(path, resovler);
        return this;
    }

    switch(path: string, navDir: NavigationDirection): PageWidget | undefined {
        const switching = (page: P) => {
            if (this.currentPage?.path === page.path) return; // prevent same page with diff path
            this.routePageMap.set(path, page);
            this.__process_fn_cache__.forEach(fn => fn(page));
            if (!page.initialized) this._listeners.create.forEach(fn => fn(page));
            this.transition(this.currentPage, page, navDir);
            (<Mutable<this>>this).currentPage = page;
        }

        // check page exist
        const EXISTED_PAGE = this.routePageMap.get(path)
        if (EXISTED_PAGE) {
            switching(EXISTED_PAGE);
            return EXISTED_PAGE;
        };

        // search registered path
        let pageOptions = this.routeInitMap.get(path)
        if (!pageOptions) {
            for (const [pathType, options] of this.routeInitMap) {
                if (typeof pathType === 'string') continue;
                if ((pathType instanceof RegExp)) {
                    // check regex route
                    const test = path.match(pathType);
                    if (!test) continue;
                    pageOptions = options;
                    break;
                } else {
                    // check function route
                    const resolvedPath = pathType(path);
                    if (!resolvedPath) continue;
                    // check page exist
                    const EXISTED_PAGE = this.routePageMap.get(resolvedPath);
                    if (EXISTED_PAGE) {
                        switching(EXISTED_PAGE);
                        return EXISTED_PAGE;
                    };
                    pageOptions = options;
                    break;
                }
            }
            if (!pageOptions) return;
        }
        // create new page 
        const page = new this.Page(path, {titleStyle: this.titleStyle, ...pageOptions});
        switching(page)
        return page;
    }

    $page(): P | undefined;
    $page(callback: PageProcessFunction<P>): this
    $page(callback?: PageProcessFunction<P>): this | P | undefined {
        if (!arguments.length) return this.currentPage;
        if (callback) this.__process_fn_cache__.add(callback);
        return this;
    }

    on<K extends keyof ViewWidgetEvents<P>>(event: K, listener: EventFunction<ViewWidgetEvents<P>, K>) {
        //@ts-ignore
        this._listeners[event].add(listener);
        return this;
    }

    transitionHandler(): typeof this.__transition_handler__;
    transitionHandler(listener: typeof this.__transition_handler__): this; 
    transitionHandler(listener?: typeof this.__transition_handler__): typeof this.__transition_handler__ | this {
        if (!arguments.length) return this.__transition_handler__;
        this.__transition_handler__ = listener
        return this;
    }

    private async transition(oldPage: P | undefined, newPage: P, navDir: NavigationDirection) {
        if (oldPage) (<Mutable<P>>oldPage).opened = false;
        (<Mutable<P>>newPage).opened = true;
        if (!this.__transition_handler__) {
            if (oldPage) {
                oldPage.remove();
            }
            newPage.setTitle();
            await newPage.init();
            this.insert(newPage);
        }
        else {
            this.__transition_handler__(oldPage, newPage, navDir);
            this._listeners.switch.forEach(fn => fn(oldPage, newPage, navDir));
        }
    }

    setTitle(page: PageWidget) {
        const PAGE_NAME = page.name();
        if (PAGE_NAME) {
            if (this.titleStyle && this.titleStyle.pageName) document.title = this.titleStyle.pageName.replaceAll('$1', `${PAGE_NAME}`);
        } else {
            if (this.titleStyle && this.titleStyle.default) document.title = this.titleStyle.default;            
        }
    }
}

export interface ViewWidgetOptions<P> extends ParentWidgetOptions {
    page?: new (...args: any[]) => P;
    titleStyle?: TitleStyle;
}
export interface TitleStyle {
    default: string;
    pageName?: string;
}

type ViewWidgetEvents<P extends PageWidget> = {
    'switch': [oldPage: P | undefined, newPage: P, navDir: NavigationDirection];
    'create': [page: P];
}

export type PageProcessFunction<P extends PageWidget> = (page: P) => void;

type RouteFunction = (path: string) => string | void;