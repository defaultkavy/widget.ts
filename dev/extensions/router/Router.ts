import { PageInitFunction, PageWidget } from "./PageWidget";
import { ViewWidget } from "./ViewWidget";

export class Router {
    views: Map<string, ViewWidget> = new Map;
    currentView?: ViewWidget;
    pageIndex = 0;
    private notFoundFn?: PageInitFunction<PageWidget>;
    prevURL?: string;
    constructor() {
    }

    open(url?: string) {
        if (typeof url !== 'string') return;
        const prevPath = location.pathname;
        if (url.replace(location.origin, '') === prevPath) return;
        this.pageIndex++;
        history.pushState({
            index: this.pageIndex
        }, '', url);
        this.execute('FORWARD')
    }

    back(replace_url?: string) {
        if (this.pageIndex === 0) {
            if (replace_url) {
                if (replace_url.replace(location.origin, '') === location.pathname) return;
                else this.replace(replace_url);
            }
        } else history.back();
    }
    
    replace(url: string) {
        history.replaceState({
            index: this.pageIndex
        }, '', url)
        this.pathChange('REPLACE')
    }

    assign(view: ViewWidget<any>) {
        this.views.set(view.path, view);
    }

    listen() {
        if (!history.state || !history.state.index) history.replaceState({
            index: this.pageIndex
        }, '')
        else this.pageIndex = history.state.index;
        this.execute('FORWARD')
        addEventListener('popstate', () => {
            if (history.state === null) return this.execute('FORWARD');
            if (history.state.index === undefined) return this.execute('FORWARD');
            if (history.state.index < this.pageIndex) {
                this.pageIndex--;
                this.execute('BACK');
            }
            if (history.state.index > this.pageIndex) {
                this.pageIndex = history.state.index;
                this.execute('FORWARD');
            }
        })
    }

    private pathChange(navDir: NavigationDirection) {
        this.prevURL = location.pathname;
        const paths = location.pathname.split('/')
        if (paths.at(-1) === '') paths.pop(); // remove last empty path
        
        for (const part in paths) {
            paths[part] = `/${paths[part]}`
            if (+part <= 1) continue;
            paths[part] = paths[+part - 1] + paths[part]
        }

        let found = false;
        for (const i in paths) {
            const view = this.views.get(paths[i]);
            if (!view) break;
            this.currentView = view;
            // Test route longest path
            const fullUrl = view.switch(location.pathname.replace(paths[i], '/').replace('//', '/'), navDir)
            if (fullUrl) return // found page
            // get second view
            const page = view.switch(paths[+i + 1], navDir)
            if (!page) break;
            else if (page && paths.length === +i + 1) return // found page
        }
        if (!found) this.onNotFound();
    }

    private hashChange() {

    }

    private execute(navDir: NavigationDirection) {
        if (!this.prevURL) return this.pathChange(navDir);
        if (location.hash) this.hashChange();
        else this.pathChange(navDir);
    }

    notFound(fn: PageInitFunction<PageWidget>) {
        this.notFoundFn = fn;
        return this;
    }

    private onNotFound() {
        if (!this.currentView) return;
        if (!this.notFoundFn) return;
        this.currentView.route('$notFound', this.notFoundFn);
        this.currentView.switch('$notFound', 'FORWARD');
    }
}

export type NavigationDirection = 'FORWARD' | 'BACK' | 'REPLACE';

export const $r = new Router;