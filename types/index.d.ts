import { Widget } from './components/Widget';
import { ParentWidget } from './components/ParentWidget';
import { ButtonWidget } from './components/ButtonWidget';
import { DivisionWidget } from './components/DivisionWidget';
import { FormWidget } from './components/FormWidget';
import { ImageWidget } from './components/ImageWidget';
import { InputWidget } from './components/InputWidget';
import { LabelWidget } from './components/LabelWidget';
import { LinkWidget } from './components/LinkWidget';
import { ListItemWidget } from './components/ListItemWidget';
import { ListWidget } from './components/ListWidget';
import { TextWidget } from './components/TextWidget';
export * from './components/Widget';
export * from './components/TextWidget';
export * from './components/InputWidget';
export * from './components/ParentWidget';
export * from './components/DivisionWidget';
export * from './components/LinkWidget';
export * from './components/SpanWidget';
export * from './components/ImageWidget';
export * from './components/ListWidget';
export * from './components/ListItemWidget';
export * from './components/ButtonWidget';
export * from './components/FormWidget';
export * from './components/LabelWidget';
export * from './extensions/router/Router';
export * from './extensions/router/PageWidget';
export * from './extensions/router/ViewWidget';
export * from './extensions/router/ViewWidget';
export * from './extensions/input-date/InputDateWidget';
export * from './extensions/input-textarea/InputTextareaWidget';
export * from './structures/WidgetUtil';
export * from './structures/FocusManager';
declare class WidgetShared {
    linkFunction?: (url: string) => void;
    focusEnabled?: boolean;
    static set options(options: GLOBAL_OPTIONS);
}
export declare const __widget_shared__: WidgetShared;
export declare function $w<K extends keyof WidgetTagNameMap>(tagName: K): WidgetTagNameMap[K];
export declare function $w<K extends string>(tagName: K): ParentWidget;
export declare function $w<K extends Widget>(widget: K): K;
export declare function $w<K extends WidgetCreateFn>(fn: K): ReturnType<K>;
export declare function $w<K extends Widget>(object: {
    $widget: K;
}): K;
export declare function $w<K extends HTMLElement>(element: K): ParentWidget;
export declare namespace $w {
    var global: typeof WidgetShared;
}
interface GLOBAL_OPTIONS {
    linkFunction?: (url: string) => void;
}
export type WidgetCreateFn = () => Widget;
export interface WidgetTagNameMap {
    "a": LinkWidget;
    "p": TextWidget;
    "h1": TextWidget;
    "h2": TextWidget;
    "h3": TextWidget;
    "h4": TextWidget;
    "h5": TextWidget;
    "h6": TextWidget;
    "strong": TextWidget;
    "em": TextWidget;
    "blockquote": TextWidget;
    "div": DivisionWidget;
    "ul": ListWidget;
    "ol": ListWidget;
    "dl": ListWidget;
    "li": ListItemWidget;
    "img": ImageWidget;
    "button": ButtonWidget;
    "form": FormWidget;
    "label": LabelWidget;
    "input": InputWidget;
}
