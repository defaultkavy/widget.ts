import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";
/**
 * ### Text Element Builder
 * Class representing a text element.
 * @param options - {@link TextWidgetBuildOptions}.
 * @class
 */
export declare class TextWidget extends ParentWidget {
    readonly element: HTMLParagraphElement | HTMLHeadingElement | HTMLElement;
    readonly type: keyof TextWidgetTypeMap;
    constructor(type: keyof TextWidgetTypeMap, options?: TextWidgetBuildOptions);
}
/**
 * Builder options of {@link TextWidget | Class: TextWidget}
 * @param type - TextWidgetTypes
 * @param content - Text content
 */
export interface TextWidgetBuildOptions extends TextWidgetOptions {
}
export interface TextWidgetOptions extends ParentWidgetOptions {
}
interface TextParagraphWidget extends TextWidget {
    element: HTMLParagraphElement;
}
interface TextHeadingWidget extends TextWidget {
    element: HTMLHeadingElement;
}
interface TextWidgetTypeMap {
    "h1": TextHeadingWidget;
    "h2": TextHeadingWidget;
    "h3": TextHeadingWidget;
    "h4": TextHeadingWidget;
    "h5": TextHeadingWidget;
    "h6": TextHeadingWidget;
    "p": TextParagraphWidget;
    "blockquote": TextWidget;
    "strong": TextWidget;
    "em": TextWidget;
    "del": TextWidget;
    "code": TextWidget;
}
export {};
