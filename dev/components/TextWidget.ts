import { Content, ParentWidget, ParentWidgetOptions, WidgetContent } from "./ParentWidget";

/**
 * ### Text Element Builder
 * Class representing a text element.
 * @param options - {@link TextWidgetBuildOptions}.
 * @class
 */
export class TextWidget extends ParentWidget {
    override readonly element: HTMLParagraphElement | HTMLHeadingElement | HTMLElement = this.element;
    readonly type: keyof TextWidgetTypeMap;
    constructor(type: keyof TextWidgetTypeMap, options?: TextWidgetBuildOptions) {
        super({
            ...options,
            tagName: type
        })
        this.type = type;
    }
}

/**
 * Builder options of {@link TextWidget | Class: TextWidget}
 * @param type - TextWidgetTypes
 * @param content - Text content
 */
export interface TextWidgetBuildOptions extends TextWidgetOptions {
}

export interface TextWidgetOptions extends ParentWidgetOptions {}

interface TextWidgetBuilderOptions extends Omit<TextWidgetBuildOptions, 'type'> {}

interface TextParagraphWidget extends TextWidget { element: HTMLParagraphElement }
interface TextHeadingWidget extends TextWidget { element: HTMLHeadingElement }
type HeadingTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TextTypes = 'strong' | 'em' | 'code' | 'blockquote' | "del"

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