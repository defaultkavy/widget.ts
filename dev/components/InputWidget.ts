import { Optional } from "./ParentWidget";
import { Widget, WidgetOptions } from "./Widget";

export class InputWidget extends Widget {
    override readonly dom: HTMLInputElement = this.dom;
    constructor(options?: InputWidgetBuildOptions) {
        super({...options, tagName: 'input'})
    }

    type(): string
    type(type?: keyof InputWidgetTypes): this
    type(type?: keyof InputWidgetTypes) {
        if (!arguments.length) return this.dom.type;
        if (type === undefined) return this;
        this.dom.type = type;
        return this;
    }

    placeholder(): string
    placeholder(text: string): this
    placeholder(text?: string): this | string {
        if (!arguments.length) return this.dom.placeholder;
        if (text === undefined) return this;
        this.dom.placeholder = text;
        return this;
    }

    maxLength(): number
    maxLength(length: number): this
    maxLength(length?: number) {
        if (!arguments.length) return this.dom.maxLength;
        if (length === undefined) return this;
        this.dom.maxLength = length;
        return this
    }

    inputMode(): string
    inputMode(mode: InputMode): this
    inputMode(mode?: InputMode): this | string {
        if (!arguments.length) return this.dom.inputMode;
        if (mode === undefined) return this;
        this.dom.inputMode = mode;
        return this;
    }


    name(): string
    name(name: string | undefined): this
    name(name?: string | undefined): this | string {
        if (!arguments.length) return this.dom.name;
        if (name === undefined) return this;
        this.dom.name = name;
        return this;
    }

    options(options: InputWidgetBuildOptions): this {
        super.options(options);
        if (options.placeholder) this.placeholder(options.placeholder);
        if (options.maxLength) this.maxLength(options.maxLength);
        if (options.inputMode) this.inputMode(options.inputMode);
        return this;
    }
    
    value(): string;
    value(value: Optional<string>): this;
    value(value?: Optional<string>): this | string {
        if (!arguments.length) return this.dom.value;
        if (value === undefined) return this;
        this.dom.value = value;
        return this;
    }

    accept(): string
    accept(...fileType: InputFileAcceptTypes[]): this
    accept(...fileType: InputFileAcceptTypes[]): this | string {
        if (!arguments.length) return this.dom.accept;
        this.dom.accept = fileType.toString();
        return this;
    }

    multiple(): boolean
    multiple(enable: boolean): this
    multiple(enable?: boolean): this | boolean {
        if (!arguments.length) return this.dom.multiple;
        if (enable !== undefined) this.dom.multiple = enable;
        return this;
    }

    autocomplete(): boolean ;
    autocomplete(enable: Optional<boolean>): this;
    autocomplete(enable?: Optional<boolean>): this | boolean {
        if (!arguments.length) return this.dom.autocomplete === 'on' ? true : false;
        if (typeof enable === 'boolean') this.dom.autocomplete = enable ? 'on' : 'off';
        return this;
    }

    files(): File[];
    async files(base64: boolean): Promise<string[]>;
    files(base64?: boolean): File[] | Promise<string[]> {
        if (base64 === true) {
            if (!this.dom.files) return [];
            const array = Promise.all(Array.from(this.dom.files).map(file => this.__fileRead__(file)));
            return array;
        }
        if (!this.dom.files) return [];
        return Array.from(this.dom.files);
    }

    private __fileRead__(file: File): Promise<string> { 
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = (e) => resolve(reader.result!.toString());
        })
    }
}

export interface InputWidgetBuildOptions extends WidgetOptions {
    placeholder?: string;
    inputMode?: InputMode;
    maxLength?: number;

}

type InputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

type InputFileFilterTypes = 'audio/*' | 'video/*' | 'image/*';

type InputFileAcceptTypes = InputFileFilterTypes | string;

export interface InputWidgetTypes {
    "text": InputWidget;
    "button": InputWidget;
    "checkbox": InputWidget;
    "date": InputWidget;
    "datetime-local": InputWidget;
    "email": InputWidget;
    "file": InputWidget;
    "hidden": InputWidget;
    "image": InputWidget;
    "month": InputWidget;
    "number": InputWidget;
    "password": InputWidget;
    "radio": InputWidget;
    "range": InputWidget;
    "reset": InputWidget;
    "search": InputWidget;
    "submit": InputWidget;
    "tel": InputWidget;
    "color": InputWidget;
    "week": InputWidget;
}