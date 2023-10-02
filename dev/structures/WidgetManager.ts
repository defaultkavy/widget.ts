import { WidgetContent, ParentWidget } from "../components/ParentWidget";
import { Widget } from "../components/Widget";
import { Mutable } from "../global";
import { $w } from "../index";

/**
 * Multiple of {@link Widget}, {@link HTMLElement}, {@link Text} manager.
 * 
 * *Generic parameter only accept Widget | Text | HTMLElement types, 
 * using Exclude<T, BaseContent> to exclude 'string' and 'undefined' types in this parameter.*
 */
export class WidgetManager<T extends WidgetContent = WidgetContent> {
    protected cache: Set<T> = new Set;
    widget: ParentWidget;
    constructor(widget: ParentWidget) {
        this.widget = widget;
    }

    get array() { return Array.from(this.cache.values()) }
    get size() { return this.cache.size }

    /**
     * 
     * Adding text - *convert string to {@link Text} element.*
     * @param {WidgetContent} resolver
     * @param {number} position
     * @returns 
     */
    add(resolver: T | undefined, position?: number) {
        // dom append method
        const append = (element: HTMLElement | Text) => {
            if (typeof position === 'number') {
                const cacheResolver = [...this.cache].at(position);
                if (cacheResolver instanceof HTMLElement) this.widget.dom.insertBefore(element, cacheResolver)
                else if (cacheResolver instanceof Widget) this.widget.dom.insertBefore(element, cacheResolver.dom);
                else this.widget.dom.append(element); // cacheResolver is undefined
            } else this.widget.dom.append(element)
        }
        // add to dom
        if (resolver === undefined) return;
        if (resolver instanceof Widget) {
            (resolver as Mutable<Widget>).parent = this.widget
            append(resolver.dom);
        }
        else append(resolver);
        // add to cache
        if (typeof position === 'number') {
            this.insertToCache(resolver, position)
        } else {
            if (this.cache.has(resolver)) this.cache.delete(resolver);
            this.cache.add(resolver);
        }
        return this;
    }
    
    insertToCache(resolver: T, position: number = 0) {
        const cacheArray = [...this.cache]
        cacheArray.splice(position, 0, resolver)
        this.cache.clear();
        cacheArray.forEach(i => this.cache.add(i));
    }

    sort(fn: (a: T, b: T) => number) {
        const cacheArray = [...this.cache].sort(fn);
        this.cache.clear();
        cacheArray.forEach(i => this.cache.add(i));
        this.build();
    }

    delete(resolver: T | undefined) {
        if (resolver === undefined) return this;
        this.cache.delete(resolver);
        if (resolver instanceof Widget) (<Mutable<Widget>>resolver).parent = undefined;
        resolver.remove();
        return this;
    }

    clear() {
        this.cache.forEach(node => node.remove());
        this.widget.dom.innerHTML = '';
        this.cache.clear();
        return this;
    }

    /**
     * Check target is child of parent.
     * @param node - Target widget or element
     * @param widgetScope - deep check every widget's nodeElement
     * @returns boolean
     */
    inCache(node: T | undefined, widgetScope: boolean = false): boolean {
        if (node === undefined) return false;
        // check every nodeElement inside widget
        if (widgetScope) {
            for (const content of this.cache.values()) {
                if (content instanceof Widget) 
                    if (content.dom === node) return true;
                    else continue;
                else if (content === node) return true;
                else continue; 
            }
            return false;
        }
        else return this.cache.has(node);
    }

    include(node: T | undefined) {
        if (node === undefined) return false;
        return this.widget.dom.contains($w.dom(node))
    }

    build() {
        const node_array = [...this.cache];
        let i = 0
        node_array.forEach(node => {
            if (!(node instanceof Widget)) return;
            if (node.hidden) node.dom.remove();
            else {
                if (node.dom.parentElement !== this.widget.dom) {
                    const last_node = node_array[i + 1];
                    if (!last_node) this.widget.dom.append(node.dom);
                    else if (last_node instanceof Widget) {
                        if (last_node.dom.parentNode) this.widget.dom.insertBefore(node.dom, last_node.dom);
                        else this.widget.dom.append(node.dom)
                    }
                    else if (last_node instanceof Node) {
                        if (last_node.parentNode) this.widget.dom.insertBefore(node.dom, last_node);
                        else this.widget.dom.append(node.dom)
                    }
                }
            }
            i++
        })
    }

    // build() {
    //     const node_array = [...this.cache].filter(node => {
    //         // filter and remove hidden widget
    //         if (node instanceof Widget && node.hidden) {
    //             node.dom.remove();
    //             return false;
    //         } else return true;
    //     }); 
    //     node_array.forEach((node, i) => {
    //         if (!(node instanceof Widget)) return;
    //         if (node.dom.parentElement !== this.widget.dom) {
    //             for (let index = i + 1; index < node_array.length; index++) {
    //                 const next_node = node_array[index];
    //                 if (!next_node) { this.widget.dom.append(node.dom); break }
    //                 if (next_node instanceof Widget) {
    //                     // prevent next node is not appended to parent
    //                     if (next_node.dom.parentElement === this.widget.dom) { this.widget.dom.insertBefore(node.dom, next_node.dom); break }
    //                     else if (index === node_array.length - 1) { this.widget.dom.append(node.dom); break }
    //                     else continue;
    //                 }
    //                 else { this.widget.dom.insertBefore(node.dom, next_node); break };
    //             }
    //         }
    //     })
    // }

    find(resolver: string): Widget | HTMLElement | null {
        const ele = this.widget.dom.querySelector(resolver);
        if (ele instanceof HTMLElement) {
            if (ele.$widget instanceof Widget) return ele.$widget;
            else return ele
        }
        else return ele as HTMLElement | null;
    }

    findAll(resolver: string): (Widget | HTMLElement)[] {
        return Array.from(this.widget.dom.querySelectorAll(resolver)).map(ele => {
            if (ele instanceof HTMLElement) {
                if (ele.$widget instanceof Widget) return ele.$widget;
                else return ele
            }
            else return ele as HTMLElement
        })
    }
}