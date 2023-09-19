import { ParentWidget } from "../../components/ParentWidget";
export declare class PageWidget extends ParentWidget {
    #private;
    constructor(path: string, initFn: PageInitFunction<PageWidget>);
    path: string;
    initFn: PageInitFunction<this>;
    readonly initialized: boolean;
    readonly opened: boolean;
    _listeners: {
        init: Set<(widget: this) => void>;
        open: Set<(widget: this) => void>;
        close: Set<(widget: this) => void>;
        refresh: Set<(widget: this) => void>;
    };
    /**
     * ### Page first load function
     * Run the page initialize function. Only work when the page first time load.
     * @returns {this}
     */
    init(): Promise<this>;
    name(): string | undefined;
    name(name: string | undefined): this;
    _open(): this;
    _close(): this;
    _refresh(): this;
    on(type: keyof typeof this._listeners, fn: (widget: this) => void): this;
}
export type PageInitFunction<P> = (page: P) => Promise<void> | void;
