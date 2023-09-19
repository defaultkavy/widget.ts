import { ParentWidget, ParentWidgetOptions } from "./ParentWidget";

export class ButtonWidget extends ParentWidget {
    override readonly dom: HTMLButtonElement = this.dom;
    constructor(options?: ButtonWidgetBuildOptions) {
        super({...options, tagName: 'button'})
    }

    options(options: ButtonWidgetBuildOptions) {
        super.options(options);
        return this;
    }
}

export interface ButtonWidgetBuildOptions extends ParentWidgetOptions {
    url?: string;
}