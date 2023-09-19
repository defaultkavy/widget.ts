import { Optional } from "./ParentWidget";
import { Widget, WidgetOptions } from "./Widget";
export declare class InputWidget extends Widget {
    readonly element: HTMLInputElement;
    constructor(options?: InputWidgetBuildOptions);
    type(): string;
    type(type?: keyof InputWidgetTypes): this;
    placeholder(): string;
    placeholder(text: string): this;
    maxLength(): number;
    maxLength(length: number): this;
    inputMode(): string;
    inputMode(mode: InputMode): this;
    name(): string;
    name(name: string | undefined): this;
    options(options: InputWidgetBuildOptions): this;
    value(): string;
    value(value: Optional<string>): this;
    accept(): string;
    accept(...fileType: InputFileAcceptTypes[]): this;
    multiple(): boolean;
    multiple(enable: boolean): this;
    autocomplete(): boolean;
    autocomplete(enable: Optional<boolean>): this;
    files(): File[];
    files(base64: boolean): Promise<string[]>;
    private __fileRead__;
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
export {};
