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

    autocomplete(): boolean ;
    autocomplete(enable: Optional<boolean>): this;
    autocomplete(enable?: Optional<boolean>): this | boolean {
        if (!arguments.length) return this.dom.autocomplete === 'on' ? true : false;
        if (typeof enable === 'boolean') this.dom.autocomplete = enable ? 'on' : 'off';
        return this;
    }
}

export interface FormWidgetBuildOptions extends ParentWidgetOptions {
    action?: string;
}