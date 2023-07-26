import { ParentWidget } from "../../components/ParentWidget";
import { Mutable } from "../../global";

export class PageWidget extends ParentWidget {
    constructor(path: string, initFn: PageInitFunction<PageWidget>) {
        super({tagName: 'page'})
        this.path = path;
        this.initFn = initFn
    }
    path: string;
    initFn: PageInitFunction<this>;
    #name?: string;
    readonly initialized: boolean = false;
    readonly opened: boolean = false;
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

    name(): string | undefined
    name(name: string | undefined): this
    name(name?: string | undefined): this | string | undefined {
        if (!arguments.length) return this.#name
        this.#name = name;
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
}

export type PageInitFunction<P> = (page: P) => Promise<void> | void;