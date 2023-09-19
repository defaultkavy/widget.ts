import { ParentWidget } from "../components/ParentWidget";
import { Widget } from "../index";
declare class FocusShared {
    readonly currentFocusManager?: FocusManager;
    readonly enabled: boolean;
    readonly view_cache: Map<Widget, FocusManager>;
    readonly controller_cache: Map<Widget, FocusManager>;
    assignFocus(manager: FocusManager): this;
    resignFocus(manager: FocusManager): this;
    enable(): this;
    disable(): this;
}
export declare const __focus_shared__: FocusShared;
export declare class FocusManager {
    readonly cache: Map<Widget, FocusManagerCacheType | undefined>;
    current?: Widget;
    private last_focus?;
    view: ParentWidget;
    readonly parentFocus?: FocusManager;
    constructor(view: ParentWidget);
    add(content: Widget, targetManager?: FocusManagerCacheType): this;
    delete(content: Widget | Widget[]): this;
    parent(focusManager: FocusManager): this;
    next(): Widget | undefined;
    prev(): Widget;
    focus(widget?: Widget): this;
    use(): this;
    enter(): this | undefined;
    back(): this;
    blur(): this;
    private __tabIndex__;
}
export interface FocusGroup {
    widget: Widget;
    manager: FocusManager | undefined;
}
export type FocusManagerCacheType = FocusManager | (() => FocusManager | undefined);
/**
 * Get focus manager of widget from cache, if manager not exist then create and return a new focus manager.
 * @param {ParentWidget} widget
 * @returns {FocusManager | undefined}
 */
export declare function $f(widget: ParentWidget): FocusManager;
export declare function $f(widget: undefined): undefined;
export declare function $f(widget: ParentWidget | undefined): FocusManager | undefined;
export declare function $f(widgetFn: (() => ParentWidget | undefined)): FocusManager | undefined;
export declare namespace $f {
    var cache: Map<Widget, FocusManager>;
    var enable: () => FocusShared;
    var addTo: (parentFocus: FocusManager, targetManager?: FocusManagerCacheType | undefined) => (widget: Widget) => FocusManager;
}
export {};
