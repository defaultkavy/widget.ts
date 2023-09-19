import { ExtensionInputWidget } from "../../components/ParentWidget";
import { EventFunction } from "../../index";
export declare class InputTextareaWidget extends ExtensionInputWidget {
    $textarea: import("../../index").DivisionWidget;
    $placeholder: import("../../index").ParentWidget;
    private _events_;
    constructor();
    value(): string;
    value(value: string | undefined): this;
    placeholder(text: string): this;
    on<K extends keyof InputTextareaWidgetEvents>(event: K, listener: EventFunction<InputTextareaWidgetEvents, K>): this;
    private __build__;
    private __listen__;
}
export type InputTextareaWidgetEvents = {
    'input': [widget: InputTextareaWidget];
};
