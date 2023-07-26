import { Optional } from "./ParentWidget";
import { Widget, WidgetOptions } from "./Widget";

export class InputWidget extends Widget {
    override readonly element: HTMLInputElement = this.element;
    constructor(options?: InputWidgetBuildOptions) {
        super({...options, tagName: 'input'})
    }

    type(): string
    type(type?: keyof InputWidgetTypes): this
    type(type?: keyof InputWidgetTypes) {
        if (!arguments.length) return this.element.type;
        if (type === undefined) return this;
        this.element.type = type;
        return this;
    }

    placeholder(): string
    placeholder(text: string): this
    placeholder(text?: string): this | string {
        if (!arguments.length) return this.element.placeholder;
        if (text === undefined) return this;
        this.element.placeholder = text;
        return this;
    }

    maxLength(): number
    maxLength(length: number): this
    maxLength(length?: number) {
        if (!arguments.length) return this.element.maxLength;
        if (length === undefined) return this;
        this.element.maxLength = length;
        return this
    }

    inputMode(): string
    inputMode(mode: InputMode): this
    inputMode(mode?: InputMode): this | string {
        if (!arguments.length) return this.element.inputMode;
        if (mode === undefined) return this;
        this.element.inputMode = mode;
        return this;
    }


    name(): string
    name(name: string | undefined): this
    name(name?: string | undefined): this | string {
        if (!arguments.length) return this.element.name;
        if (name === undefined) return this;
        this.element.name = name;
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
        if (!arguments.length) return this.element.value;
        if (value === undefined) return this;
        this.element.value = value;
        return this;
    }

    accept(): string
    accept(...fileType: InputFileAcceptTypes[]): this
    accept(...fileType: InputFileAcceptTypes[]): this | string {
        if (!arguments.length) return this.element.accept;
        this.element.accept = fileType.toString();
        return this;
    }

    multiple(): boolean
    multiple(enable: boolean): this
    multiple(enable?: boolean): this | boolean {
        if (!arguments.length) return this.element.multiple;
        if (enable !== undefined) this.element.multiple = enable;
        return this;
    }

    autocomplete(): boolean ;
    autocomplete(enable: Optional<boolean>): this;
    autocomplete(enable?: Optional<boolean>): this | boolean {
        if (!arguments.length) return this.element.autocomplete === 'on' ? true : false;
        if (typeof enable === 'boolean') this.element.autocomplete = enable ? 'on' : 'off';
        return this;
    }

    files(): File[];
    async files(base64: boolean): Promise<string[]>;
    files(base64?: boolean): File[] | Promise<string[]> {
        if (base64 === true) {
            if (!this.element.files) return [];
            const array = Promise.all(Array.from(this.element.files).map(file => this.__fileRead__(file)));
            return array;
        }
        if (!this.element.files) return [];
        return Array.from(this.element.files);
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