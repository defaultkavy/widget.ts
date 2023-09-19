import { DivisionWidget } from "../components/DivisionWidget";
import { ImageWidget } from "../components/ImageWidget";
import { LinkWidget } from "../components/LinkWidget";
import { ListItemWidget } from "../components/ListItemWidget";
import { ListWidget } from "../components/ListWidget";
import { ParentWidget } from "../components/ParentWidget";
import { TextWidget } from "../components/TextWidget";
import { Widget } from "../components/Widget";
import { WidgetTagNameMap } from "../index";

export class WidgetUtil {
    static widgetify = widgetify;
}

export function widgetify(element: HTMLElement, options?: WidgetifyOptions) {
    const process_options = options ? options.process : undefined;
    const parse = (node: HTMLElement | Text) => {
        let widget: Widget | undefined = undefined
        if (node instanceof Text) return node;
        const tagName = node.tagName.toLowerCase();
        //@ts-expect-error
        const process__node_options = process_options ? process_options[tagName] : undefined;
        // create custom widget
        if (process__node_options) {
            if (process__node_options.widget) widget = process__node_options.widget(node);
        }
        if (!widget) {
            switch (node.nodeName) {
                case 'DIV': widget = new DivisionWidget(); break;
                case 'P': widget = new TextWidget('p'); break;
                case 'H1': widget = new TextWidget('h1'); break;
                case 'H2': widget = new TextWidget('h2'); break;
                case 'H3': widget = new TextWidget('h3'); break;
                case 'H4': widget = new TextWidget('h4'); break;
                case 'H5': widget = new TextWidget('h5'); break;
                case 'H6': widget = new TextWidget('h6'); break;
                case 'STRONG': widget = new TextWidget('strong'); break;
                case 'B': widget = new TextWidget('strong'); break;
                case 'EM': widget = new TextWidget('em'); break;
                case 'I': widget = new TextWidget('em'); break;
                case 'DEL': widget = new TextWidget('del'); break;
                case 'BLOCKQUOTE': widget = new TextWidget('blockquote'); break;
                case 'CODE': widget = new TextWidget('code'); break;
                case 'A': widget = new LinkWidget({url: node instanceof HTMLAnchorElement ? node.href : undefined}); break;
                case 'IMG': widget = new ImageWidget({
                    url: node instanceof HTMLImageElement ? node.src : '',
                    alt: node instanceof HTMLImageElement ? node.alt : undefined,
                    width: node instanceof HTMLImageElement ? node.width : undefined,
                    height: node instanceof HTMLImageElement ? node.height : undefined,
                    anchor: node instanceof HTMLImageElement ? node.dataset.anchor ? JSON.parse(node.dataset.anchor) : [0.5, 0.5] : [0.5, 0.5],
                    class: node instanceof HTMLImageElement ? Array.from(node.classList) : undefined,
                }); break;
                case 'UL': widget = new ListWidget('ul'); break;
                case 'OL': widget = new ListWidget('ol'); break;
                case 'LI': widget = new ListItemWidget({value: node instanceof HTMLLIElement ? node.value : undefined}); break;
            }
        }
        if (!widget) widget = new ParentWidget({tagName: tagName});
        // basic settings
        if (widget) {
            widget.id(node.id.length ? node.id : undefined);
            Array.from(node.classList).forEach(classname => widget?.class(classname))
        }
        if (widget instanceof ParentWidget) {
            for (const child of Array.from(node.childNodes)) {
                const childWidget = parse(child as HTMLElement | Text);
                if (childWidget) widget.insert(childWidget)
            }
        }
        if (process__node_options) {
            if (process__node_options instanceof Function) process__node_options(widget)
            else process__node_options.renderer(widget, node);
        }
        return widget ?? node;
    }
    if (element.nodeName === 'BODY') {
        return Array.from(element.children).map(ele => parse(ele as HTMLElement)) as Widget[];
    }
    const result = parse(element);
    if (!(result instanceof Widget)) throw 'Parse node error';
    return result; 
}

export interface WidgetifyOptions {
    process?: {
        [key in keyof WidgetTagNameMap]?: (widget: WidgetTagNameMap[key]) => void;
    } | {
        [key in string]?: {
            widget: (referElement: HTMLElement) => ThisType<ParentWidget>;
            renderer: (widget: ParentWidget, referElement: HTMLElement) => void;
        };
    };
}