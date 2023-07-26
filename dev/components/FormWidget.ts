import { Optional, ParentWidget, ParentWidgetOptions } from "./ParentWidget";

export class FormWidget extends ParentWidget {
    override readonly element: HTMLFormElement = this.element;
    constructor(options?: FormWidgetBuildOptions) {
        super({...options, tagName: 'form'})
    }

    action(url: string) {
        this.element.action = url;
        return this;
    }

    method(method: 'GET' | 'POST') {
        this.element.method = method;
        return this;
    }

    options(options: FormWidgetBuildOptions) {
        super.options(options);
        if (options.action) this.action(options.action);
        return this;
    }

    autocomplete(): boolean ;
    autocomplete(enable: Optional<boolean>): this;
    autocomplete(enable?: Optional<boolean>): this | boolean {
        if (!arguments.length) return this.element.autocomplete === 'on' ? true : false;
        if (typeof enable === 'boolean') this.element.autocomplete = enable ? 'on' : 'off';
        return this;
    }
}

export interface FormWidgetBuildOptions extends ParentWidgetOptions {
    action?: string;
}