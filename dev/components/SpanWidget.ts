import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";

export class SpanWidget extends ParentWidget {
    override readonly dom: HTMLSpanElement = this.dom;
    constructor(options?: SpanWidgetBuilderOptions) {
        super({...options, tagName: 'span'})
    }
}

export interface SpanWidgetBuilderOptions extends ParentWidgetOptions {

}