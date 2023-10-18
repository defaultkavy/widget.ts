import { Widget } from "./components/Widget";
import { $w as $widget } from "./index";
import { $r as $router } from "./index";

declare namespace $w {
    interface $w extends Function {
        options: {}
    }
}

declare global {
    const $w = $widget;
    const $r = $router;
    interface HTMLElement {
        $widget?: Widget
    }

    type Mutable<T> = {
        -readonly [k in keyof T]: T[k];
     };
    
    type Optional<C> = C | undefined;
    
    type Multable<C> = C | C[];
    
    type Complex<C> = C | Complex<C>[];
}