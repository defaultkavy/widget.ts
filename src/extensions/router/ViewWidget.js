var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ParentWidget } from "../../components/ParentWidget";
import { PageWidget } from "./PageWidget";
import { $r } from "./Router";
export class ViewWidget extends ParentWidget {
    constructor(path, options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'view' }));
        this.routeInitMap = new Map;
        this.routePageMap = new Map;
        this.Page = PageWidget;
        this.__process_fn_cache__ = new Set;
        this._listeners = {
            switch: new Set,
            create: new Set,
        };
        this.path = path;
        this.options(options);
        $r.assign(this);
    }
    options(options) {
        if (options === undefined)
            return this;
        super.options(options);
        if (options.page)
            this.Page = options.page;
        return this;
    }
    route(path, fn) {
        this.__add__(path, fn);
        return this;
    }
    switch(path, navDir) {
        const switching = (page) => {
            this.routePageMap.set(path, page);
            this.__process_fn_cache__.forEach(fn => fn(page));
            if (!page.initialized)
                this._listeners.create.forEach(fn => fn(page));
            this.transition(this.currentPage, page, navDir);
            this.currentPage = page;
        };
        // check page exist
        const EXISTED_PAGE = this.routePageMap.get(path);
        if (EXISTED_PAGE) {
            switching(EXISTED_PAGE);
            return EXISTED_PAGE;
        }
        ;
        let fn = this.routeInitMap.get(path);
        if (!fn) {
            // check regex route
            for (const [regex, pageFn] of this.routeInitMap) {
                if (!(regex instanceof RegExp))
                    continue;
                const test = path.match(regex);
                if (test) {
                    fn = pageFn;
                    break;
                }
                else {
                    continue;
                }
            }
            if (!fn)
                return;
        }
        // create new page 
        const page = new this.Page(path, fn);
        switching(page);
        return page;
    }
    $page(callback) {
        if (!arguments.length)
            return this.currentPage;
        if (callback)
            this.__process_fn_cache__.add(callback);
        return this;
    }
    on(event, listener) {
        //@ts-ignore
        this._listeners[event].add(listener);
        return this;
    }
    transitionHandler(listener) {
        if (!arguments.length)
            return this.__transition_handler__;
        this.__transition_handler__ = listener;
        return this;
    }
    transition(oldPage, newPage, navDir) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldPage)
                oldPage.opened = false;
            newPage.opened = true;
            if (!this.__transition_handler__) {
                if (oldPage) {
                    oldPage.remove();
                }
                yield newPage.init();
                this.insert(newPage);
            }
            else {
                this.__transition_handler__(oldPage, newPage, navDir);
                this._listeners.switch.forEach(fn => fn(oldPage, newPage, navDir));
            }
        });
    }
    __add__(path, fn) {
        this.routeInitMap.set(path, fn);
    }
}
//# sourceMappingURL=ViewWidget.js.map