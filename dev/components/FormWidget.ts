import { Optional, ParentWidget, ParentWidgetOptions } from "./ParentWidget";

export class FormWidget extends ParentWidget {
    override readonly dom: HTMLFormElement = this.dom;
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

    options(options: FormWidgetBuildOptions) {
        super.options(options);
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

export interface FormWidgetBuildOptions extends ParentWidgetOptions {
    action?: string;
}