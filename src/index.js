import { Widget } from './components/Widget';
import { ParentWidget } from './components/ParentWidget';
import { ButtonWidget } from './components/ButtonWidget';
import { DivisionWidget } from './components/DivisionWidget';
import { FormWidget } from './components/FormWidget';
import { ImageWidget } from './components/ImageWidget';
import { InputWidget } from './components/InputWidget';
import { LabelWidget } from './components/LabelWidget';
import { LinkWidget } from './components/LinkWidget';
import { ListItemWidget } from './components/ListItemWidget';
import { ListWidget } from './components/ListWidget';
import { TextWidget } from './components/TextWidget';
import { WidgetUtil } from './structures/WidgetUtil';
export * from './components/Widget';
export * from './components/TextWidget';
export * from './components/InputWidget';
export * from './components/ParentWidget';
export * from './components/DivisionWidget';
export * from './components/LinkWidget';
export * from './components/SpanWidget';
export * from './components/ImageWidget';
export * from './components/ListWidget';
export * from './components/ListItemWidget';
export * from './components/ButtonWidget';
export * from './components/FormWidget';
export * from './components/LabelWidget';
export * from './extensions/router/Router';
export * from './extensions/router/PageWidget';
export * from './extensions/router/ViewWidget';
export * from './extensions/router/ViewWidget';
export * from './extensions/input-date/InputDateWidget';
export * from './extensions/input-textarea/InputTextareaWidget';
export * from './structures/WidgetUtil';
export * from './structures/FocusManager';
class WidgetShared {
    static set options(options) {
        __widget_shared__.linkFunction = options.linkFunction;
    }
}
export const __widget_shared__ = new WidgetShared();
export function $w(resolver) {
    if (resolver instanceof Widget)
        return resolver;
    if (resolver instanceof Function)
        return resolver();
    if (resolver instanceof HTMLElement)
        WidgetUtil.widgetify(resolver);
    if (resolver['$widget'] instanceof Widget)
        return resolver['$widget'];
    if (typeof resolver === 'string') {
        switch (resolver) {
            case 'a': return new LinkWidget();
            case 'p': return new TextWidget('p');
            case 'h1': return new TextWidget('h1');
            case 'h2': return new TextWidget('h2');
            case 'h3': return new TextWidget('h3');
            case 'h4': return new TextWidget('h4');
            case 'h5': return new TextWidget('h5');
            case 'h6': return new TextWidget('h6');
            case 'strong': return new TextWidget('strong');
            case 'em': return new TextWidget('em');
            case 'blockquote': return new TextWidget('blockquote');
            case 'div': return new DivisionWidget();
            case 'ul': return new ListWidget('ul');
            case 'ol': return new ListWidget('ol');
            case 'dl': return new ListWidget('dl');
            case 'li': return new ListItemWidget();
            case 'img': return new ImageWidget();
            case 'button': return new ButtonWidget();
            case 'form': return new FormWidget();
            case 'label': return new LabelWidget();
            case 'input': return new InputWidget();
        }
        return new ParentWidget({
            tagName: resolver
        });
    }
    throw '$w: unknown type of parameter';
}
$w.global = WidgetShared;
//# sourceMappingURL=index.js.map