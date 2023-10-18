import { Widget, WidgetConfig } from "./Widget";

export class CanvasWidget extends Widget<HTMLCanvasElement> {
    constructor(options?: CanvasWidgetBuildOptions) {
        super({...options, tagName: 'canvas'})
    }
}

export interface CanvasWidgetBuildOptions extends WidgetConfig {
}