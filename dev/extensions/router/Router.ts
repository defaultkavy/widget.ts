import { PageInitFunction, PageWidget } from "./PageWidget";
import { ViewWidget } from "./ViewWidget";

export class Router {
    views: Map<string, ViewWidget> = new Map;
    currentView?: ViewWidget;
    pageIndex = 0;
    private notFoundFn?: PageInitFunction<PageWidget>;
    private _onhash = new Set<(prevHash: string | undefined, nextHash: string | undefined) => void>
    private _onpath = new Set<(prevPath: string | undefined, nextPath: string) => void>
    prevURL?: string;
    constructor() {
    }

    open(url?: string) {
        if (typeof url !== 'string') return false;
        const prevPath = location.pathname;
        const prevHash = location.hash;
        const path = url.replace(location.origin, '')
        if (path === prevPath || path === prevHash || path === `${prevPath}${prevHash}`) return false;
        this.pageIndex++;
        history.pushState({
            index: this.pageIndex
        }, '', url);
        this.execute('FORWARD')
        return true;
    }

    async back(replace_url?: string): Promise<void> {
        return new Promise(resolve => {
            if (this.pageIndex === 0) {
                if (replace_url) {
                    if (replace_url.replace(location.origin, '') === location.pathname) return;
                    else this.replace(replace_url);
                }
            } else history.back();
            const fn = () => {
                resolve();
                window.removeEventListener('popstate', fn)
            }
            window.addEventListener('popstate', fn)
        })
    }
    
    replace(url: string) {
        history.replaceState({
            index: this.pageIndex
        }, '', url)
        this.execute('REPLACE')
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
        const paths = location.pathname.split('/')
        if (paths.at(-1) === '') paths.pop(); // remove last empty path
        for (const part in paths) {
            paths[part] = `/${paths[part]}`
            if (+part <= 1) continue;
            paths[part] = paths[+part - 1] + paths[part]
        }
        const prevURL = this.prevURL ? new URL(this.prevURL) : undefined;
        this._onpath.forEach(fn => fn(prevURL?.pathname, location.pathname))
        this.prevURL = location.href;
        let found = false;
        for (const i in paths) {
            // find view with every full path
            const view = this.views.get(paths[i]);
            if (!view) continue;
            this.currentView = view;
            getPage(view, +i)
        }
        if (!found) this.onNotFound();

        function getPage(view: ViewWidget, pathIndex: number) {
            // reverse to test longest path first
            const view_paths = paths.slice(pathIndex).reverse();
            for (let i = 0; i < paths.length; i ++) {
                const pagePath = view_paths[i].replace(view.path, '/').replace('//', '/')
                const page = view.switch(pagePath, navDir);
                if (page) {
                    found = true
                    return;
                }
            }
        }
    }

    private hashChange() {
        const prevURL = this.prevURL ? new URL(this.prevURL) : undefined;
        this.prevURL = location.href;
        this._onhash.forEach(fn => fn(prevURL?.hash, location.hash.length ? location.hash : undefined))
    }

    private execute(navDir: NavigationDirection) {
        if (!this.prevURL) return this.pathChange(navDir);
        const url = new URL(this.prevURL);
        if (url.pathname !== location.pathname) return this.pathChange(navDir);
        if (url.hash !== location.hash) this.hashChange();
    }

    notFound(fn: PageInitFunction<PageWidget>) {
        this.notFoundFn = fn;
        return this;
    }

    onhash(fn: (prevHash: string | undefined, nextHash: string | undefined) => void) {
        this._onhash.add(fn);
        return this;
    }

    onpath(fn: (prevPath: string | undefined, nextPath: string) => void) {
        this._onpath.add(fn);
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