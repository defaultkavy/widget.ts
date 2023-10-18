import { $w, WidgetUtil } from "../index";
import { WidgetManager } from "../structures/WidgetManager";
import { Widget, WidgetBuildConfig, WidgetConfig } from "./Widget";

// catch child insert without widget function
const CHILD_OBSERVER = new MutationObserver(p1 => {
    p1.forEach(record => {
        record.addedNodes.forEach((node, key, parent) => {
            const IS_TEXT = node instanceof Text;
            const widget = node.parentElement?.$widget
            const PARENT_IS_WIDGET = widget instanceof ParentWidget;
            if (IS_TEXT && PARENT_IS_WIDGET && widget.children.inCache(node))
            widget.children.insertToCache(node, key);
        })
    })
})
export class ParentWidget extends Widget {
    readonly dom: HTMLElement = super.dom;
    readonly children = new WidgetManager(this);
    constructor(options: ParentWidgetBuildConfig) {
        super({...options, tagName: options.tagName})
        CHILD_OBSERVER.observe(this.dom, {childList: true})
        this.editable('plaintext-only')
    }

    config(options: ParentWidgetConfig): this {
        super.config(options);
        this.editable(options.editable);
        return this;
    }

    /**
     * Get widget text content.
     * @returns {string}
     */
    content(): string;
    /**
     * ### Replace content to parent widget
     * Set child node to this widget, child can be string, {@link Text} node, {@link Widget}.
     * @param resolver - string or {@link WidgetContent}, can be array.
     * @returns {this}
     */
    content(resolver: Complex<Multable<Optional<Content>>> | (($this: this) => Complex<Multable<Optional<Content>>>)): this;
    content(resolver?: Complex<Multable<Optional<Content>>> | (($this: this) => Complex<Multable<Optional<Content>>>)): this | string {
        if (!arguments.length) return this.dom.innerText;
        this.clear();
        this.insert(resolver);
        return this;
    }

    /**
     * ### Append child to parent
     * Adding child node to this widget, child can be string, {@link Text} node, {@link Widget}.
     * @param resolver - string or {@link WidgetContent}, can be array.
     * @returns {this}
     */
    insert(resolver?: Complex<Multable<Optional<Content>>> | (($this: this) => Complex<Multable<Optional<Content>>>), position?: number): this {
        if (resolver instanceof Array) resolver.forEach(content => this.insert(content));
        else if (typeof resolver === 'string') this.children.add(new Text(resolver), position);
        else if (resolver instanceof Function) this.insert(resolver(this));
        else this.children.add(resolver, position);
        return this;
    }

    /**
     * ### Remove child from parent
     * Remove child node from this parent widget, the parameter should be {@link Text} node or {@link Widget}.
     * @param resolver - {@link WidgetContent}, can be array.
     * @returns {this}
     */
    detach(resolver: Multable<Optional<WidgetContent>>): this {
        if (resolver instanceof Array) {
            resolver.forEach(node => {this.children.delete(node)})
        } else this.children.delete(resolver);
        return this;
    }

    /**
     * ### Remove all children from parent.
     * This function is direct to {@link ParentWidget}.children.clear(), but will return this widget.
     * @returns {this}
     */
    clear(): this {
        this.children.clear();
        return this;
    }

    editable = WidgetUtil.fluent(this, this.dom, 'contentEditable').overload<'plaintext-only' | boolean>();
}

export interface ParentWidgetBuildConfig extends WidgetBuildConfig, ParentWidgetConfig {}

export interface ParentWidgetConfig extends WidgetConfig {
    editable?: boolean;
}

export type WidgetContent = Widget | Text | HTMLElement;

export type BaseContent = string;

export type Content = BaseContent | WidgetContent | undefined;

/**
 * Extension Widget for custom input type
 */
export abstract class ExtensionInputWidget extends ParentWidget {
    protected readonly hidden_input = $w('input').type('hidden');
    constructor(options: ExtensionInputWidgetBuildOptions) {
        super({...options})
        this.insert(this.hidden_input);
    }
    
    value(): string;
    value(value?: string | undefined): this;
    value(value?: string | undefined): this | string {
        if (!arguments.length) return this.hidden_input.value();
        if (value === undefined) return this;
        this.hidden_input.value(value);
        return this;
    }

    name(): string
    name(name: string): this
    name(name?: string | undefined): this | string {
        if (!arguments.length) return this.hidden_input.name();
        if (name === undefined) return this;
        this.hidden_input.name(name);
        this.hidden_input.id(name);
        return this;
    }

    clear(force = false) {
        super.clear();
        if (!force) this.insert(this.hidden_input);
        return this;
    }
}

export interface ExtensionInputWidgetBuildOptions extends ParentWidgetBuildConfig, ExtensionInputWidgetOptions {}

export interface ExtensionInputWidgetOptions extends ParentWidgetConfig {};