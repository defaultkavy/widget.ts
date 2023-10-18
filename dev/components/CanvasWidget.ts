import { Widget, WidgetConfig } from "./Widget";

export class CanvasWidget extends Widget {
    readonly dom = super.dom as HTMLCanvasElement;
    constructor(options?: CanvasWidgetBuildOptions) {
        super({...options, tagName: 'canvas'})
    }
}

export interface CanvasWidgetBuildOptions extends WidgetConfig {
}