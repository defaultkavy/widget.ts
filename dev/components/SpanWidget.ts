import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";

export class SpanWidget extends ParentWidget {
    override readonly element: HTMLSpanElement = this.element;
    constructor(options: SpanWidgetBuilderOptions) {
        super({...options, tagName: 'span'})
    }
}

export interface SpanWidgetBuilderOptions extends ParentWidgetOptions {

}