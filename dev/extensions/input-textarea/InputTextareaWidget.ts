import { ExtensionInputWidget } from "../../components/ParentWidget";
import { $w } from "../../index";

export class InputTextareaWidget extends ExtensionInputWidget {
    $textarea = $w('span').class('content').editable(true);
    $placeholder = $w('span').class('placeholder')
    constructor() {
        super({
            tagName: 'input-textarea'
        });
        this.__listen__();
        this.__build__();
    }
    
    value(): string;
    value(value: string): this;
    value(value?: string | undefined): string | this {
        if (!arguments.length) return super.value();
        this.$textarea.content(value);
        super.value(value);
        return this;
    }

    placeholder(text: string) {
        this.$placeholder.content(text);
        return this;
    }

    private __build__() {
        this.insert([
            $w(this.$placeholder),
            $w(this.$textarea)
        ])
    }

    private __listen__() {
        new MutationObserver(() => {
            super.value(this.$textarea.content())
            this.$textarea.content() !== '' ? this.$placeholder.hide() : this.$placeholder.show();
        }).observe(this.$textarea.element, {characterData: true, childList: true, subtree: true})
    }
}