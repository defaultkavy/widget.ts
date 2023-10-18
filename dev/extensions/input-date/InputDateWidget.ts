import { InputWidget, InputWidgetConfig } from "../../components/InputWidget";
import { ExtensionInputWidget, ParentWidgetConfig } from "../../components/ParentWidget";
import { Mutable } from "../../global";
import { $w, Widget, __widget_shared__ } from "../../index";

export class InputDateWidget extends ExtensionInputWidget {
    day = $w('input');
    month = $w('input');
    year = $w('input');
    focusable = true;
    readonly dateString: string = 'dd/mm/yyyy';
    private __onInput__?: onFunction;
    private __onKeydown__?: onFunction;
    private __onComplete__?: (widget: this) => void;
    constructor(options?: InputDateWidgetBuildOptions) {
        super({...options, tagName: 'input-date'})
        if (options) this.config(options);
        this.__build__();
        this.__listen__();
    }

    get isValid() { return !this.day.dom.validity.customError }

    setDateString(style: string) {
        (<Mutable<this>>this).dateString = style;
        this.clear();
        this.__build__();
        return this;
    }

    config(options: InputDateWidgetBuildOptions): this {
        super.config(options);
        if (options.dateString) this.setDateString(options.dateString);
        return this;
    }

    clear() {
        super.clear();
        return this;
    }

    onInput(fn: onFunction) {
        this.__onInput__ = fn;
        return this;
    }

    onKeydown(fn: onFunction) {
        this.__onKeydown__ = fn;
        return this;
    }

    onComplete(fn: (widget: this) => void) {
        this.__onComplete__ = fn;
        return this;
    }

    private __build__() {
        const options: () => InputWidgetConfig = () => {
            return {
                inputMode: 'decimal'
            }
        }
        this.day
            .setAttribute('type', 'date-day')
            .config(options())
            .maxLength(2)
            .placeholder('DD')
        this.month
            .setAttribute('type', 'date-month')
            .config(options())
            .maxLength(2)
            .placeholder('MM')
        this.year
            .setAttribute('type', 'date-year')
            .config(options())
            .maxLength(4)
            .placeholder('YYYY')
        const regex = /(dd|mm|yyyy)/g;
        const convert = this.dateString.replaceAll(regex, ($0, $1) => `%$${$0}%$`)
        const array: Widget[] = [];
        let i = 0;
        for (const word of convert.split('%$')) {
            if (word === '') continue;
            else if (word === 'dd') array.push(this.day)
            else if (word === 'mm') array.push(this.month)
            else if (word === 'yyyy') array.push(this.year)
            else array.push($w('span').insert(word))
        }
        this.insert([...array])
    }

    private __listen__() {
        const keydown = (e: KeyboardEvent, widget: InputWidget) => {
            let prevent = false; 
            const event = {
                preventDefault: () => {
                    prevent = true;
                },
                target: widget,
                this: this
            }
            if (this.__onKeydown__) this.__onKeydown__(event);
            if (prevent) return;
            if (!/[0-9]|Backspace/.test(e.key)) e.preventDefault();
            if (e.key === 'Backspace' && widget.value().length === 0) {
                const array = this.children.array;
                const prevInput = array.splice(0, array.indexOf(widget) - 1).reverse().find(w => {
                    if (w instanceof InputWidget) return true;
                    return false;
                })
                if (prevInput instanceof InputWidget) prevInput.focus();
            }
        }

        const input = (widget: InputWidget) => {
            let prevent = false; 
            const event = {
                preventDefault: () => {
                    prevent = true;
                },
                target: widget,
                this: this
            }
            if (this.__onInput__) this.__onInput__(event);
            if (prevent) return;
            this.__setValue__();
            if (widget.value().length >= widget.dom.maxLength) {
                const array = this.children.array;
                const nextInput = array.splice(array.indexOf(widget) + 1).find(w => {
                    if (w instanceof InputWidget) return true;
                    return false;
                })
                if (nextInput instanceof InputWidget) nextInput.focus();
                else {
                    // block back focus when input is invalid
                    if (this.isValid)
                        if (this.__onComplete__) this.__onComplete__(this);
                }
            }
        }
        this.day.setListener('input', e => {
            input(this.day);
        })
        .setListener('keydown', e => {
            keydown(e, this.day)
        })
        this.month.setListener('input', e => {
            input(this.month);
        })
        .setListener('keydown', e => {
            keydown(e, this.month)
        })
        this.year.setListener('input', e => {
            input(this.year);
        })
        .setListener('keydown', e => {
            keydown(e, this.year)
        })
    }

    private __setValue__() {
        this.value(`${this.year.value() ? this.year.value() : '0000'}-${this.month.value() ? this.month.value() : '01'}${this.day.value() ? '-' + this.day.value() : ''}`)
        
        if (this.day.value())
        if (new Date(this.value()).toString() === 'Invalid Date') {
            this.day.dom.setCustomValidity('Invalid Date')
            this.month.dom.setCustomValidity('Invalid Date')
            this.year.dom.setCustomValidity('Invalid Date')
        }
        else {
            this.day.dom.setCustomValidity('');
            this.month.dom.setCustomValidity('');
            this.year.dom.setCustomValidity('');
        }
    }
}

export interface InputDateWidgetBuildOptions extends ParentWidgetConfig {
    dateString: string;
}

type onFunction = (event: WidgetEvent) => void;

type WidgetEvent = {
    preventDefault: Function;
    this: InputDateWidget;
    target: InputWidget;
}