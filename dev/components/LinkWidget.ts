import { __widget_shared__ } from "../index";
import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class LinkWidget extends ParentWidget {
    readonly dom = super.dom as HTMLAnchorElement;
    loadFn?: (url: string, e: Event, w: this) => void;
    override readonly focusable = true;
    constructor(options?: LinkWidgetBuildOptions) {
        super({...options, tagName: 'a'});
        if (options) {
            if (options.url) this.dom.href = options.url;
        }
        this.dom.addEventListener('click', e => {
            if (!this.url()) return;
            if (this.loadFn || __widget_shared__.linkFunction) {
                e.preventDefault();
                if (this.loadFn) this.loadFn(this.dom.href, e, this);
                else if (__widget_shared__.linkFunction) __widget_shared__.linkFunction(this.url())
            }
        })
    }

    url(): string;
    url(url?: string, loadFn?: (url: string, e: Event, w: this) => void): this;
    url(url?: string, loadFn?: (url: string, e: Event, w: this) => void): this | string {
        if (!arguments.length) return this.dom.href;
        if (typeof url === 'string') this.dom.href = url;
        this.loadFn = loadFn;
        return this;
    }

    preventDefault(): this {
        this.loadFn = undefined;
        return this;
    }
}

export interface LinkWidgetBuildOptions extends ParentWidgetConfig {
    url?: string;
}