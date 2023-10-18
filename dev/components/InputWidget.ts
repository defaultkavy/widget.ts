import { WidgetUtil } from "../structures/WidgetUtil";
import { Widget, WidgetConfig } from "./Widget";

export class InputWidget extends Widget {
    readonly dom = super.dom as HTMLInputElement;
    constructor(options?: InputWidgetConfig) {
        super({...options, tagName: 'input'})
    }

    config(options: InputWidgetConfig): this {
        super.config(options);
        this.placeholder(options.placeholder);
        this.type(options.type);
        this.disable(options.disable);
        this.maxLength(options.maxLength);
        this.inputMode(options.inputMode);
        this.multiple(options.multiple);
        this.name(options.name);
        if (options.accept) this.accept(...(options.accept));
        this.spellcheck(options.spellcheck);
        this.required(options.required);
        return this;
    }

    disable(): boolean;
    disable(boolean: Optional<boolean>): this;
    disable(boolean?: Optional<boolean>) {
        if (!arguments.length) return this.dom.disabled;
        if (typeof boolean === 'boolean') this.dom.disabled = boolean;
        return this;
    }

    type(): string
    type(type?: Optional<keyof InputWidgetTypes>): this
    type(type?: Optional<keyof InputWidgetTypes>) {
        if (!arguments.length) return this.dom.type;
        if (type === undefined) return this;
        this.dom.type = type;
        return this;
    }

    placeholder(): string
    placeholder(text: Optional<string>): this
    placeholder(text?: Optional<string>): this | string {
        if (!arguments.length) return this.dom.placeholder;
        if (typeof text !== 'string') return this;
        this.dom.placeholder = text;
        return this;
    }

    maxLength(): number
    maxLength(length: Optional<number>): this
    maxLength(length?: Optional<number>) {
        if (!arguments.length) return this.dom.maxLength;
        if (typeof length !== 'number') return this;
        this.dom.maxLength = length;
        return this
    }

    inputMode(): string
    inputMode(mode: Optional<InputMode>): this
    inputMode(mode?: Optional<InputMode>): this | string {
        if (!arguments.length) return this.dom.inputMode;
        if (typeof mode !== 'string') return this;
        this.dom.inputMode = mode;
        return this;
    }

    name(): string
    name(name: Optional<string>): this
    name(name?: Optional<string>): this | string {
        if (!arguments.length) return this.dom.name;
        if (typeof name === 'string') this.dom.name = name;
        return this;
    }
    
    value(): string;
    value(value: Optional<string>): this;
    value(value?: Optional<string>): this | string {
        if (!arguments.length) return this.dom.value;
        if (typeof value !== 'string') return this;
        this.dom.value = value;
        return this;
    }

    accept(): string
    accept(...fileType: Optional<InputFileAcceptTypes>[]): this
    accept(...fileType: Optional<InputFileAcceptTypes>[]): this | string {
        if (!arguments.length) return this.dom.accept;
        fileType = WidgetUtil.undefinedFilter(fileType);
        this.dom.accept = fileType.toString();
        return this;
    }

    multiple(): boolean
    multiple(enable: Optional<boolean>): this
    multiple(enable?: Optional<boolean>): this | boolean {
        if (!arguments.length) return this.dom.multiple;
        if (typeof enable === 'boolean') this.dom.multiple = enable;
        return this;
    }

    required(): boolean
    required(required: Optional<boolean>): this
    required(required?: Optional<boolean>): this | boolean {
        if (!arguments.length) return this.dom.required;
        if (typeof required === 'boolean') this.dom.required = required;
        return this;
    }

    autocomplete(): AutoFill ;
    autocomplete(type: Optional<AutoFill>): this;
    autocomplete(type?: Optional<AutoFill>) {
        if (!arguments.length) return this.dom.autocomplete;
        if (typeof type === 'string') this.dom.autocomplete = type;
        return this;
    }

    spellcheck(): boolean
    spellcheck(enable: Optional<boolean>): this
    spellcheck(enable?: Optional<boolean>): this | boolean {
        if (!arguments.length) return this.dom.spellcheck;
        if (typeof enable === 'boolean') this.dom.spellcheck = enable;
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

export interface InputWidgetConfig extends WidgetConfig {
    type?: keyof InputWidgetTypes;
    disable?: boolean;
    multiple?: boolean;
    name?: string;
    accept?: InputFileAcceptTypes[];
    spellcheck?: boolean;
    placeholder?: string;
    inputMode?: InputMode;
    maxLength?: number;
    required?: boolean;
}

export type InputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

export type InputFileFilterTypes = 'audio/*' | 'video/*' | 'image/*';

export type InputFileAcceptTypes = InputFileFilterTypes | string;

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