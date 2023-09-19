import { InputWidget } from "../../components/InputWidget";
import { ExtensionInputWidget } from "../../components/ParentWidget";
import { $w } from "../../index";
export class InputDateWidget extends ExtensionInputWidget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'input-date' }));
        this.day = $w('input');
        this.month = $w('input');
        this.year = $w('input');
        this.focusable = true;
        this.dateString = 'dd/mm/yyyy';
        if (options)
            this.options(options);
        this.__build__();
        this.__listen__();
    }
    get isValid() { return !this.day.element.validity.customError; }
    setDateString(style) {
        this.dateString = style;
        this.clear();
        this.__build__();
        return this;
    }
    options(options) {
        super.options(options);
        if (options.dateString)
            this.setDateString(options.dateString);
        return this;
    }
    clear() {
        super.clear();
        return this;
    }
    onInput(fn) {
        this.__onInput__ = fn;
        return this;
    }
    onKeydown(fn) {
        this.__onKeydown__ = fn;
        return this;
    }
    onComplete(fn) {
        this.__onComplete__ = fn;
        return this;
    }
    __build__() {
        const options = () => {
            return {
                inputMode: 'decimal'
            };
        };
        this.day
            .setAttribute('type', 'date-day')
            .options(options())
            .maxLength(2)
            .placeholder('DD');
        this.month
            .setAttribute('type', 'date-month')
            .options(options())
            .maxLength(2)
            .placeholder('MM');
        this.year
            .setAttribute('type', 'date-year')
            .options(options())
            .maxLength(4)
            .placeholder('YYYY');
        const regex = /(dd|mm|yyyy)/g;
        const convert = this.dateString.replaceAll(regex, ($0, $1) => `%$${$0}%$`);
        const array = [];
        let i = 0;
        for (const word of convert.split('%$')) {
            if (word === '')
                continue;
            else if (word === 'dd')
                array.push(this.day);
            else if (word === 'mm')
                array.push(this.month);
            else if (word === 'yyyy')
                array.push(this.year);
            else
                array.push($w('span').insert(word));
        }
        this.insert([...array]);
    }
    __listen__() {
        const keydown = (e, widget) => {
            let prevent = false;
            const event = {
                preventDefault: () => {
                    prevent = true;
                },
                target: widget,
                this: this
            };
            if (this.__onKeydown__)
                this.__onKeydown__(event);
            if (prevent)
                return;
            if (!/[0-9]|Backspace/.test(e.key))
                e.preventDefault();
            if (e.key === 'Backspace' && widget.value().length === 0) {
                const array = this.children.array;
                const prevInput = array.splice(0, array.indexOf(widget) - 1).reverse().find(w => {
                    if (w instanceof InputWidget)
                        return true;
                    return false;
                });
                if (prevInput instanceof InputWidget)
                    prevInput.focus();
            }
        };
        const input = (widget) => {
            let prevent = false;
            const event = {
                preventDefault: () => {
                    prevent = true;
                },
                target: widget,
                this: this
            };
            if (this.__onInput__)
                this.__onInput__(event);
            if (prevent)
                return;
            this.__setValue__();
            if (widget.value().length >= widget.element.maxLength) {
                const array = this.children.array;
                const nextInput = array.splice(array.indexOf(widget) + 1).find(w => {
                    if (w instanceof InputWidget)
                        return true;
                    return false;
                });
                if (nextInput instanceof InputWidget)
                    nextInput.focus();
                else {
                    // block back focus when input is invalid
                    if (this.isValid)
                        if (this.__onComplete__)
                            this.__onComplete__(this);
                }
            }
        };
        this.day.setListener('input', e => {
            input(this.day);
        })
            .setListener('keydown', e => {
            keydown(e, this.day);
        });
        this.month.setListener('input', e => {
            input(this.month);
        })
            .setListener('keydown', e => {
            keydown(e, this.month);
        });
        this.year.setListener('input', e => {
            input(this.year);
        })
            .setListener('keydown', e => {
            keydown(e, this.year);
        });
    }
    __setValue__() {
        this.value(`${this.year.value() ? this.year.value() : '0000'}-${this.month.value() ? this.month.value() : '01'}${this.day.value() ? '-' + this.day.value() : ''}`);
        if (this.day.value())
            if (new Date(this.value()).toString() === 'Invalid Date') {
                this.day.element.setCustomValidity('Invalid Date');
                this.month.element.setCustomValidity('Invalid Date');
                this.year.element.setCustomValidity('Invalid Date');
            }
            else {
                this.day.element.setCustomValidity('');
                this.month.element.setCustomValidity('');
                this.year.element.setCustomValidity('');
            }
    }
}
//# sourceMappingURL=InputDateWidget.js.map