import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class SpanWidget extends ParentWidget {
    readonly dom = super.dom as HTMLSpanElement;
    constructor(config?: SpanWidgetConfig) {
        super({...config, tagName: 'span'})
    }
}

export interface SpanWidgetConfig extends ParentWidgetConfig {

}