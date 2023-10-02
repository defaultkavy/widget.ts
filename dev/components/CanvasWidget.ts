import { Widget, WidgetOptions } from "./Widget";

export class CanvasWidget extends Widget {
    override readonly dom: HTMLCanvasElement = this.dom;
    constructor(options?: CanvasWidgetBuildOptions) {
        super({...options, tagName: 'canvas'})
    }
}

export interface CanvasWidgetBuildOptions extends WidgetOptions {
}