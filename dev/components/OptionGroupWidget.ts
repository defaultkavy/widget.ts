import { WidgetUtil } from "../structures/WidgetUtil";
import { OptionWidgetConfig, OptionWidget } from "./OptionWidget";
import { ParentWidget, ParentWidgetConfig } from "./ParentWidget";

export class OptionGroupWidget extends ParentWidget {
    readonly dom = super.dom as HTMLOptGroupElement;
    constructor(config?: OptionGroupWidgetConfig) {
        super({tagName: 'optgroup'})
        this.config(config);
    }

    config(config: Optional<OptionGroupWidgetConfig>) {
        if (!config) return this;
        super.config(config);
        this.disable(config.disable);
        this.label(config.label);
        return this;
    }

    disable(): boolean;
    disable(boolean: Optional<boolean>): this;
    disable(boolean?: Optional<boolean>) {
        if (!arguments.length) return this.dom.disabled;
        if (typeof boolean === 'boolean') this.dom.disabled = boolean;
        return this;
    }
    
    label(): string;
    label(text: Optional<string>): this;
    label(text?: Optional<string>): this | string {
        if (!arguments.length) return this.dom.label;
        if (typeof text === 'string') this.dom.label = text;
        return this;
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
}

export interface OptionGroupWidgetConfig extends ParentWidgetConfig {
    disable?: boolean;
    label?: string;
    value?: string;
    selected?: boolean;
}