import { InputWidget } from "../../components/InputWidget";
import { ExtensionInputWidget, ParentWidgetOptions } from "../../components/ParentWidget";
export declare class InputDateWidget extends ExtensionInputWidget {
    day: InputWidget;
    month: InputWidget;
    year: InputWidget;
    focusable: boolean;
    readonly dateString: string;
    private __onInput__?;
    private __onKeydown__?;
    private __onComplete__?;
    constructor(options?: InputDateWidgetBuildOptions);
    get isValid(): boolean;
    setDateString(style: string): this;
    options(options: InputDateWidgetBuildOptions): this;
    clear(): this;
    onInput(fn: onFunction): this;
    onKeydown(fn: onFunction): this;
    onComplete(fn: (widget: this) => void): this;
    private __build__;
    private __listen__;
    private __setValue__;
}
export interface InputDateWidgetBuildOptions extends ParentWidgetOptions {
    dateString: string;
}
type onFunction = (event: WidgetEvent) => void;
type WidgetEvent = {
    preventDefault: Function;
    this: InputDateWidget;
    target: InputWidget;
};
export {};
