import { ParentWidget, ParentWidgetOptions } from "../../components/ParentWidget";
import { Mutable } from "../../global";
import { TitleStyle } from "./ViewWidget";

export class PageWidget extends ParentWidget {
    constructor(path: string, options: PageWidgetOptions<PageWidget>) {
        super({tagName: 'page', ...options})
        this.path = path;
        this.initFn = options.init;
        this.titleStyle = options.titleStyle;
    }
    path: string;
    readonly initFn: PageInitFunction<this>;
    #name?: string;
    readonly initialized: boolean = false;
    readonly opened: boolean = false;
    titleStyle?: TitleStyle;
    _listeners = {
        init: new Set<(widget: this) => void>,
        open: new Set<(widget: this) => void>,
        close: new Set<(widget: this) => void>,
        refresh: new Set<(widget: this) => void>
    }

    /**
     * ### Page first load function
     * Run the page initialize function. Only work when the page first time load.
     * @returns {this}
     */
    async init(): Promise<this> {
        if (!this.initialized) {
            await this.initFn(this);
            this._listeners.init.forEach(fn => fn(this));
            (<Mutable<PageWidget>>this).initialized = true;
        }
        return this;
    }

    /**
     * Page name getter and setter, set the name will change document title.
     */
    name(): string | undefined
    name(name: string | undefined): this
    name(name?: string | undefined): this | string | undefined {
        if (!arguments.length) return this.#name;
        if (typeof name === 'string') this.#name = name;
        this.setTitle();
        return this;
    }

    _open() {
        this._listeners.open.forEach(fn => fn(this))
        return this;
    }

    _close() {
        this._listeners.close.forEach(fn => fn(this))
        return this;
    }

    _refresh() {
        this._listeners.refresh.forEach(fn => fn(this))
        return this;
    }

    on(type: keyof typeof this._listeners, fn: (widget: this) => void) {
        this._listeners[type].add(fn);
        return this;
    }

    setTitle() {
        const PAGE_NAME = this.name();
        if (!this.opened) return;
        if (PAGE_NAME) {
            if (this.titleStyle && this.titleStyle.pageName) document.title = this.titleStyle.pageName.replaceAll('$1', `${PAGE_NAME}`);
        } else {
            if (this.titleStyle && this.titleStyle.default) document.title = this.titleStyle.default;            
        }
    }
}

export type PageInitFunction<P extends PageWidget> = (page: P) => Promise<void> | void;

export interface PageWidgetOptions<P extends PageWidget> extends Omit<ParentWidgetOptions, 'tagName'> {
    init: PageInitFunction<P>,
    titleStyle?: TitleStyle;
}