import { ParentWidget } from "../components/ParentWidget";
import { Mutable } from "../global";
import { __widget_shared__, Widget } from "../index";

const __keydown__ = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        if (!__focus_shared__.currentFocusManager) return;
        if (e.shiftKey) __focus_shared__.currentFocusManager.prev();
        else __focus_shared__.currentFocusManager.next();
    }
    // prevent Enter default keydown action cause bug
    if (e.key === 'Enter') e.preventDefault();
}
const __keyup__ = (e: KeyboardEvent) => {
    if (document.hasFocus() && (/Enter| /.test(e.key))) {
        e.preventDefault();
        if (__focus_shared__.currentFocusManager) __focus_shared__.currentFocusManager.enter();
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        if (__focus_shared__.currentFocusManager) __focus_shared__.currentFocusManager.back();
    }
}
const __click__ = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement)
        if (e.target.$widget) __focus_shared__.controller_cache.get(e.target.$widget)?.focus(e.target.$widget);
}

class FocusShared {
    readonly currentFocusManager?: FocusManager;
    readonly enabled: boolean = false;
    readonly view_cache: Map<Widget, FocusManager> = new Map;
    readonly controller_cache: Map<Widget, FocusManager> = new Map;

    assignFocus(manager: FocusManager) {
        (<Mutable<FocusShared>>this).currentFocusManager = manager;
        return this;
    }

    resignFocus(manager: FocusManager): this {
        (<Mutable<FocusShared>>this).currentFocusManager = manager.parentFocus ?? manager;
        return this;
    }

    enable() {
        (<Mutable<this>>this).enabled = true;
        window.addEventListener('keydown', __keydown__)
        window.addEventListener('keyup', __keyup__)
        window.addEventListener('click', __click__)
        return this;
    }

    disable() {
        (<Mutable<this>>this).enabled = false;
        window.removeEventListener('keydown', __keydown__)
        window.removeEventListener('keyup', __keyup__)
        window.removeEventListener('click', __click__)
        return this;
    }
}

export const __focus_shared__ = new FocusShared;
const intersection = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.setAttribute('data-visible', `${entry.isIntersecting}`)
    })
});
const __remove__ = (widget: Widget) => __focus_shared__.controller_cache.get(widget)?.delete(widget);

export class FocusManager {
    readonly cache: Map<Widget, FocusManagerCacheType | undefined> = new Map();
    current?: Widget;
    private last_focus?: Widget;
    view: ParentWidget;
    readonly parentFocus?: FocusManager;
    constructor(view: ParentWidget) {
        this.view = view;
        __focus_shared__.view_cache.set(view, this);
    }

    add(content: Widget, targetManager?: FocusManagerCacheType): this;
    add(content: Widget | FocusGroup | FocusGroup[] | [Widget, FocusManager | undefined][], targetManager?: FocusManager) {
        const setter = (widget: Widget, manager?: FocusManager) => {
            this.cache.set(widget, manager);
            // (<Mutable<Widget>>widget).focusController = this;
            if (manager) (<Mutable<FocusManager>>manager).parentFocus = this;
            intersection.observe(widget.element);
            widget.onRemove(__remove__)
            __focus_shared__.controller_cache.set(widget, this);
        }
        if (content instanceof Widget) setter(content, targetManager);
        else for (const group of [...(content instanceof Array ? content : [content])])
            if (group instanceof Array) setter(group[0], group[1]);
            else setter(group.widget, group.manager);
        this.__tabIndex__();
        return this;
    }
    
    delete(content: Widget | Widget[]) {
        for (const widget of [...(content instanceof Array ? content : [content])]) {
            this.cache.delete(widget);
            __focus_shared__.controller_cache.delete(widget);
        }
        return this;
    }

    parent(focusManager: FocusManager) {
        (<Mutable<FocusManager>>this).parentFocus = focusManager;
        return this;
    }

    next() {
        if (this.current) {
            const array = [...this.cache.keys()]
            const i = array.indexOf(this.current);
            const next = i === this.cache.size - 1 ? array[0] : array[i + 1]
            next.focus();
            this.current = next;
        }
        else {
            const visibleContent = [...this.cache].find(widget => widget[0].element.dataset.visible === 'true');
            if (visibleContent) this.current = visibleContent[0];
            else {
                const first = [...this.cache.keys()][0]
                if (first && first.isRendered()) 
                    this.current = [...this.cache.keys()][0]
            }
            if (this.current) this.current.focus();
        }
        return this.current;
    }

    prev() {
        if (this.current) {
            const array = [...this.cache.keys()]
            const i = array.indexOf(this.current);
            const prev = array.at(i - 1);
            if (prev) {
                prev.focus();
                this.current = prev;
            }
        }
        else {
            const visibleContent = [...this.cache].find(widget => widget[0].element.dataset.visible === 'true');
            if (visibleContent) this.current = visibleContent[0];
            else this.current = [...this.cache.keys()][0]
            if (this.current) this.current.focus();
        }
        return this.current;
    }

    focus(widget?: Widget) {
        this.use();
        if (!widget) {
            if (this.last_focus && this.cache.has(this.last_focus)) {
                this.focus(this.last_focus);
                this.last_focus = undefined;
            }
            else this.next();
            return this;
        }
        if (!this.cache.has(widget)) return this;
        this.current = widget;
        widget.focus();
        return this;
    }

    use() {
        __focus_shared__.assignFocus(this);
        return this;
    }

    enter() {
        if (!this.current) return this;
        this.current.execute();
        // after execute, manager getter function should be defined. 
        const resolver = this.cache.get(this.current)
        if (!resolver) return;
        const entryFocus: FocusManager | undefined = resolver instanceof FocusManager ? resolver : resolver();
        if (!entryFocus) return this;
        this.last_focus = this.current;
        this.blur();
        entryFocus.focus();
        return this;
    }

    back() {
        __focus_shared__.resignFocus(this);
        // back to parent focus manager, and focus this view
        if (this.parentFocus) this.parentFocus.focus(this.view);
        this.blur();
        return this;
    }

    blur() {
        const target = this.current;
        this.current = undefined;
        if (target) target.blur();
        return this;
    }

    private __tabIndex__() {
        const array = [...this.cache.keys()]
        for (const i in array) {
            array[i].element.tabIndex = +i; 
        }
    }
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
export function $f(widget: ParentWidget): FocusManager;
export function $f(widget: undefined): undefined;
export function $f(widget: ParentWidget | undefined): FocusManager | undefined;
export function $f(widgetFn: (() => ParentWidget | undefined)): FocusManager | undefined;
export function $f(resolver: (() => ParentWidget | undefined) | ParentWidget | undefined): FocusManager | undefined {
    if (!resolver) return undefined;
    if (resolver instanceof ParentWidget) {
        const focus_manager = __focus_shared__.view_cache.get(resolver);
        if (focus_manager) return focus_manager;
        else return new FocusManager(resolver);
    }
    else {
        const widget = resolver();
        if (widget) {
            const focus_manager = __focus_shared__.view_cache.get(widget);
            if (focus_manager) return focus_manager;
            else return new FocusManager(widget);
        }
        else return;
    }
}

$f.cache = __focus_shared__.view_cache;
$f.enable = () => __focus_shared__.enable();
$f.addTo = (parentFocus: FocusManager, targetManager?: FocusManagerCacheType) => (widget: Widget) => parentFocus.add(widget, targetManager)