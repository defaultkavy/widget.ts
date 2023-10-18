import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class SpanWidget extends ParentWidget<HTMLSpanElement> {
    constructor(config?: SpanWidgetConfig) {
        super({...config, tagName: 'span'})
    }
}

export interface SpanWidgetConfig extends ParentWidgetConfig {

}