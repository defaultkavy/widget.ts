import { ExtensionInputWidget } from "../../components/ParentWidget";
import { $w, EventFunction } from "../../index";

export class InputTextareaWidget extends ExtensionInputWidget {
    $textarea = $w('div').class('content').editable('plaintext-only');
    $placeholder = $w('span').class('placeholder');
    private _events_ = {
        input: new Set as Set<EventFunction<InputTextareaWidgetEvents, 'input'>>
    }
    constructor() {
        super({
            tagName: 'input-textarea'
        });
        this.__listen__();
        this.__build__();
    }
    
    value(): string;
    value(value: string | undefined): this;
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

    on<K extends keyof InputTextareaWidgetEvents>(event: K, listener: EventFunction<InputTextareaWidgetEvents, K>) {
        this._events_.input.add(listener);
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
            this._events_.input.forEach(fn => fn(this))
        }).observe(this.$textarea.dom, {characterData: true, childList: true, subtree: true})
    }
}

export type InputTextareaWidgetEvents = {
    'input': [widget: InputTextareaWidget];
}