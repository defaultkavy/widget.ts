import { WidgetUtil } from "../structures/WidgetUtil";
import { OptionGroupWidget, OptionGroupWidgetConfig } from "./OptionGroupWidget";
import { OptionWidget, OptionWidgetConfig } from "./OptionWidget";
import { ParentWidget } from "./ParentWidget";

export class SelectWidget extends ParentWidget<HTMLSelectElement> {
    constructor() {
        super({tagName: 'select'})
    }

    option(options: Multable<Optional<string | [string, Optional<OptionWidgetConfig>]>>) {
        options = WidgetUtil.resolveMultable(options);
        options.forEach((option) => {
            if (!option) return;
            if (typeof option === 'string') {
                this.insert(new OptionWidget().content(option))
                return;
            }
            const [text, config] = option;
            this.insert(new OptionWidget(config).content(text))
        })
        return this;
    }

    group(text: string, options?: Multable<Optional<string | [string, Optional<OptionWidgetConfig>]>>, config?: OptionGroupWidgetConfig) {
        const group = new OptionGroupWidget(config).content(text);
        options = WidgetUtil.resolveMultable(options);
        group.option(options);
        return this;
    }

    name(): string
    name(name: Optional<string>): this
    name(name?: Optional<string>): this | string {
        return WidgetUtil.getset(this, arguments, this.dom, 'name');
    }

    multiple(): boolean
    multiple(multiple: Optional<boolean>): this
    multiple(multiple?: Optional<boolean>): this | boolean {
        return WidgetUtil.getset(this, arguments, this.dom, 'multiple');
    }

    required(): boolean
    required(required: Optional<boolean>): this
    required(required?: Optional<boolean>): this | boolean {
        return WidgetUtil.getset(this, arguments, this.dom, 'required');
    }

    size(): number
    size(size: Optional<number>): this
    size(size?: Optional<number>): this | number {
        return WidgetUtil.getset(this, arguments, this.dom, 'size');
    }
}