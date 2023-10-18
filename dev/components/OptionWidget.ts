import { WidgetUtil } from "../structures/WidgetUtil";
import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class OptionWidget extends ParentWidget {
    readonly dom = super.dom as HTMLOptionElement;
    constructor(config?: OptionWidgetConfig) {
        super({tagName: 'option'})
        this.config(config);
    }

    config(config: Optional<OptionWidgetConfig>) {
        if (!config) return this;
        super.config(config);
        this.disabled(config.disable);
        this.label(config.label);
        this.value(config.value);
        this.selected(config.selected);

        return this;
    }
    disabled = WidgetUtil.fluent(this, this.dom, 'disabled').fn;
    label = WidgetUtil.fluent(this, this.dom, 'label').fn;
    value = WidgetUtil.fluent(this, this.dom, 'value').fn;
    selected = WidgetUtil.fluent(this, this.dom, 'selected').fn;
}

export interface OptionWidgetConfig extends ParentWidgetConfig {
    disable?: boolean;
    label?: string;
    value?: string;
    selected?: boolean;
}