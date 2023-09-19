import { Widget } from "./Widget";
export class InputWidget extends Widget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'input' }));
        this.element = this.element;
    }
    type(type) {
        if (!arguments.length)
            return this.element.type;
        if (type === undefined)
            return this;
        this.element.type = type;
        return this;
    }
    placeholder(text) {
        if (!arguments.length)
            return this.element.placeholder;
        if (text === undefined)
            return this;
        this.element.placeholder = text;
        return this;
    }
    maxLength(length) {
        if (!arguments.length)
            return this.element.maxLength;
        if (length === undefined)
            return this;
        this.element.maxLength = length;
        return this;
    }
    inputMode(mode) {
        if (!arguments.length)
            return this.element.inputMode;
        if (mode === undefined)
            return this;
        this.element.inputMode = mode;
        return this;
    }
    name(name) {
        if (!arguments.length)
            return this.element.name;
        if (name === undefined)
            return this;
        this.element.name = name;
        return this;
    }
    options(options) {
        super.options(options);
        if (options.placeholder)
            this.placeholder(options.placeholder);
        if (options.maxLength)
            this.maxLength(options.maxLength);
        if (options.inputMode)
            this.inputMode(options.inputMode);
        return this;
    }
    value(value) {
        if (!arguments.length)
            return this.element.value;
        if (value === undefined)
            return this;
        this.element.value = value;
        return this;
    }
    accept(...fileType) {
        if (!arguments.length)
            return this.element.accept;
        this.element.accept = fileType.toString();
        return this;
    }
    multiple(enable) {
        if (!arguments.length)
            return this.element.multiple;
        if (enable !== undefined)
            this.element.multiple = enable;
        return this;
    }
    autocomplete(enable) {
        if (!arguments.length)
            return this.element.autocomplete === 'on' ? true : false;
        if (typeof enable === 'boolean')
            this.element.autocomplete = enable ? 'on' : 'off';
        return this;
    }
    files(base64) {
        if (base64 === true) {
            if (!this.element.files)
                return [];
            const array = Promise.all(Array.from(this.element.files).map(file => this.__fileRead__(file)));
            return array;
        }
        if (!this.element.files)
            return [];
        return Array.from(this.element.files);
    }
    __fileRead__(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => resolve(reader.result.toString());
        });
    }
}
//# sourceMappingURL=InputWidget.js.map