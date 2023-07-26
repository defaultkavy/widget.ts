import { Widget } from "./components/Widget";

export type Mutable<T> = {
    -readonly [k in keyof T]: T[k];
 };

 declare namespace $w {
     interface $w extends Function {
         options: {}
     }
 }

declare global {
    interface HTMLElement {
        $widget?: Widget
    }
}