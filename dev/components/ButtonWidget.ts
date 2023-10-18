import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class ButtonWidget extends ParentWidget {
    readonly dom = super.dom as HTMLButtonElement;
    constructor(options?: ButtonWidgetBuildOptions) {
        super({...options, tagName: 'button'})
    }

    config(options: ButtonWidgetBuildOptions) {
        super.config(options);
        return this;
    }
}

export interface ButtonWidgetBuildOptions extends ParentWidgetConfig {
    url?: string;
}