import { ExtensionInputWidget } from "../../components/ParentWidget";
import { $w } from "../../index";
export class InputTextareaWidget extends ExtensionInputWidget {
    constructor() {
        super({
            tagName: 'input-textarea'
        });
        this.$textarea = $w('div').class('content').editable('plaintext-only');
        this.$placeholder = $w('span').class('placeholder');
        this._events_ = {
            input: new Set
        };
        this.__listen__();
        this.__build__();
    }
    value(value) {
        if (!arguments.length)
            return super.value();
        this.$textarea.content(value);
        super.value(value);
        return this;
    }
    placeholder(text) {
        this.$placeholder.content(text);
        return this;
    }
    on(event, listener) {
        this._events_.input.add(listener);
        return this;
    }
    __build__() {
        this.insert([
            $w(this.$placeholder),
            $w(this.$textarea)
        ]);
    }
    __listen__() {
        new MutationObserver(() => {
            super.value(this.$textarea.content());
            this.$textarea.content() !== '' ? this.$placeholder.hide() : this.$placeholder.show();
            this._events_.input.forEach(fn => fn(this));
        }).observe(this.$textarea.element, { characterData: true, childList: true, subtree: true });
    }
}
//# sourceMappingURL=InputTextareaWidget.js.map