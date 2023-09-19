import { ParentWidget } from "../components/ParentWidget";
import { Widget } from "../components/Widget";
/**
 * Multiple of {@link Widget}, {@link HTMLElement}, {@link Text} manager.
 *
 * *Generic parameter only accept Widget | Text | HTMLElement types,
 * using Exclude<T, BaseContent> to exclude 'string' and 'undefined' types in this parameter.*
 */
export class WidgetManager {
    constructor(widget) {
        this.cache = new Set;
        this.widget = widget;
    }
    get array() { return Array.from(this.cache.values()); }
    get size() { return this.cache.size; }
    /**
     *
     * Adding text - *convert string to {@link Text} element.*
     * @param {WidgetContent} resolver
     * @param {number} position
     * @returns
     */
    add(resolver, position) {
        // dom append method
        const append = (element) => {
            if (typeof position === 'number') {
                const cacheResolver = [...this.cache].at(position);
                if (cacheResolver instanceof HTMLElement)
                    this.widget.element.insertBefore(element, cacheResolver);
                else if (cacheResolver instanceof Widget)
                    this.widget.element.insertBefore(element, cacheResolver.element);
                else
                    this.widget.element.append(element); // cacheResolver is undefined
            }
            else
                this.widget.element.append(element);
        };
        // add to dom
        if (resolver === undefined)
            return;
        if (resolver instanceof Widget) {
            resolver.parent = this.widget;
            append(resolver.element);
        }
        else
            append(resolver);
        // add to cache
        if (typeof position === 'number') {
            this.insertToCache(resolver, position);
        }
        else {
            if (this.cache.has(resolver))
                this.cache.delete(resolver);
            this.cache.add(resolver);
        }
        return this;
    }
    insertToCache(resolver, position) {
        const cacheArray = [...this.cache];
        cacheArray.splice(position, 0, resolver);
        this.cache.clear();
        cacheArray.forEach(i => this.cache.add(i));
    }
    delete(resolver) {
        if (resolver === undefined)
            return this;
        this.cache.delete(resolver);
        if (resolver instanceof Widget)
            resolver.parent = undefined;
        resolver.remove();
        return this;
    }
    clear() {
        this.cache.forEach(node => node.remove());
        this.widget.element.innerHTML = '';
        this.cache.clear();
        return this;
    }
    /**
     * Check target is child of parent.
     * @param node - Target widget or element
     * @param widgetScope - deep check every widget's nodeElement
     * @returns boolean
     */
    has(node, widgetScope = false) {
        // check every nodeElement inside widget
        if (widgetScope) {
            for (const content of this.cache.values()) {
                if (content instanceof Widget)
                    if (content.element === node)
                        return true;
                    else
                        continue;
                else if (content === node)
                    return true;
                else
                    continue;
            }
            return false;
        }
        else
            return this.cache.has(node);
    }
    include(node) {
        if (node === undefined)
            return false;
        const findNode = (n) => {
            for (const childNode of Array.from(n.childNodes)) {
                if (childNode === node)
                    return true;
                else if (findNode(childNode))
                    return true;
            }
            return false;
        };
        if (node instanceof Node)
            return findNode(this.widget.element);
        else
            for (const child of this.cache.values()) {
                if (node === child)
                    return true;
                if (child instanceof ParentWidget)
                    if (child.children.include(node))
                        return true;
                    else if (child instanceof HTMLElement)
                        return findNode(child);
            }
    }
    build() {
        const node_array = [...this.cache];
        let i = 0;
        node_array.forEach(node => {
            if (!(node instanceof Widget))
                return;
            if (node.hidden)
                node.element.remove();
            else {
                if (node.element.parentElement !== this.widget.element) {
                    const last_node = node_array[i + 1];
                    if (!last_node)
                        this.widget.element.append(node.element);
                    else if (last_node instanceof Widget)
                        this.widget.element.insertBefore(node.element, last_node.element);
                    else if (last_node instanceof Node)
                        this.widget.element.insertBefore(node.element, last_node);
                }
            }
            i++;
        });
    }
    find(resolver) {
        return this.widget.element.querySelector(resolver);
    }
}
//# sourceMappingURL=WidgetManager.js.map