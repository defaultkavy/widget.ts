import { $w } from "../index";
import { WidgetManager } from "../structures/WidgetManager";
import { InputWidget } from "./InputWidget";
import { Widget } from "./Widget";
// catch child insert without widget function
const CHILD_OBSERVER = new MutationObserver(p1 => {
    p1.forEach(record => {
        record.addedNodes.forEach((node, key, parent) => {
            var _a;
            const IS_TEXT = node instanceof Text;
            const widget = (_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.$widget;
            const PARENT_IS_WIDGET = widget instanceof ParentWidget;
            if (IS_TEXT && PARENT_IS_WIDGET && widget.children.has(node))
                widget.children.insertToCache(node, key);
        });
    });
});
export class ParentWidget extends Widget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: options.tagName }));
        this.element = this.element;
        this.children = new WidgetManager(this);
        CHILD_OBSERVER.observe(this.element, { childList: true });
    }
    content(resolver) {
        if (!arguments.length)
            return this.element.innerText;
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
    insert(resolver, position) {
        if (resolver instanceof Array)
            resolver.forEach(content => this.insert(content));
        else if (typeof resolver === 'string')
            this.children.add(new Text(resolver), position);
        else
            this.children.add(resolver, position);
        return this;
    }
    /**
     * ### Remove child from parent
     * Remove child node from this parent widget, the parameter should be {@link Text} node or {@link Widget}.
     * @param resolver - {@link WidgetContent}, can be array.
     * @returns {this}
     */
    detach(resolver) {
        if (resolver instanceof Array) {
            resolver.forEach(node => { this.children.delete(node); });
        }
        else
            this.children.delete(resolver);
        return this;
    }
    /**
     * ### Remove all children from parent.
     * This function is direct to {@link ParentWidget}.children.clear(), but will return this widget.
     * @returns {this}
     */
    clear() {
        this.children.clear();
        return this;
    }
    options(options) {
        super.options(options);
        if (options.editable)
            this.element.contentEditable = 'true';
        return this;
    }
    group(name, contents) {
        for (const content of contents) {
            if (!(content instanceof Widget))
                continue;
            if (content.is('label')) {
                content.for(name);
            }
            else if (content instanceof InputWidget) {
                content.id(name);
                content.element.name = name;
            }
            else if (content instanceof ExtensionInputWidget) {
                content.name(name);
            }
        }
        this.insert(contents);
        return this;
    }
    editable(value) {
        if (!arguments.length)
            return this.element.contentEditable;
        if (value === undefined)
            return this;
        this.element.contentEditable = `${value}`;
        return this;
    }
}
/**
 * Extension Widget for custom input type
 */
export class ExtensionInputWidget extends ParentWidget {
    constructor(options) {
        super(Object.assign({}, options));
        this.hidden_input = $w('input').type('hidden');
        this.insert(this.hidden_input);
    }
    value(value) {
        if (!arguments.length)
            return this.hidden_input.value();
        if (value === undefined)
            return this;
        this.hidden_input.value(value);
        return this;
    }
    name(name) {
        if (!arguments.length)
            return this.hidden_input.name();
        if (name === undefined)
            return this;
        this.hidden_input.name(name);
        this.hidden_input.id(name);
        return this;
    }
    clear(force = false) {
        super.clear();
        if (!force)
            this.insert(this.hidden_input);
        return this;
    }
}
;
//# sourceMappingURL=ParentWidget.js.map