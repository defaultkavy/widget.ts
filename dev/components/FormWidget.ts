import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class FormWidget extends ParentWidget {
    readonly dom = super.dom as HTMLFormElement;
    constructor(options?: FormWidgetBuildOptions) {
        super({...options, tagName: 'form'})
    }

    action(url: string) {
        this.dom.action = url;
        return this;
    }

    method(method: 'GET' | 'POST') {
        this.dom.method = method;
        return this;
    }

    config(options: FormWidgetBuildOptions) {
        super.config(options);
        if (options.action) this.action(options.action);
        return this;
    }

    autocomplete(): AutoFillBase ;
    autocomplete(type: Optional<AutoFillBase>): this;
    autocomplete(type?: Optional<AutoFillBase>) {
        if (!arguments.length) return this.dom.autocomplete;
        if (typeof type === 'string') this.dom.autocomplete = type;
        return this;
    }
}

export interface FormWidgetBuildOptions extends ParentWidgetConfig {
    action?: string;
}