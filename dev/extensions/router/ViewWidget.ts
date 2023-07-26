import { ParentWidget, ParentWidgetOptions } from "../../components/ParentWidget";
import { Mutable } from "../../global";
import { EventFunction } from "../../index";
import { PageWidget, PageInitFunction } from "./PageWidget";
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
    readonly routeInitMap: Map<string | RegExp, PageInitFunction<P>> = new Map;
    readonly routePageMap: Map<string, P> = new Map;
    readonly path: string;
    readonly currentPage?: P;
    readonly Page: new (...args: any[]) => any = PageWidget;
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
        return this
    }

    route(path: string | RegExp, fn: PageInitFunction<P>) {
        this.__add__(path, fn);
        return this;
    }

    switch(path: string, navDir: NavigationDirection) {
        const switching = (page: P) => {
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

        let fn = this.routeInitMap.get(path)
        if (!fn) {
            // check regex route
            for (const [regex, pageFn] of this.routeInitMap) {
                if (!(regex instanceof RegExp)) continue;
                const test = path.match(regex);
                if (test) {
                    fn = pageFn;
                    break
                } else {
                    continue
                }
            }
            if (!fn) return;
        }

        // create new page 
        const page = new this.Page(path, fn);
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
            await newPage.init();
            this.insert(newPage);
        }
        else {
            this.__transition_handler__(oldPage, newPage, navDir);
            this._listeners.switch.forEach(fn => fn(oldPage, newPage, navDir));
        }
    }

    private __add__(path: string | RegExp, fn: PageInitFunction<P>) {
        this.routeInitMap.set(path, fn);
    }
}

export interface ViewWidgetOptions<P> extends ParentWidgetOptions {
    page?: new (...args: any[]) => P
}

type ViewWidgetEvents<P extends PageWidget> = {
    'switch': [oldPage: P | undefined, newPage: P, navDir: NavigationDirection];
    'create': [page: P];
}

export type PageProcessFunction<P extends PageWidget> = (page: P) => void;