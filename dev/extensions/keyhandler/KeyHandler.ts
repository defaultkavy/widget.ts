import { $w, Widget, WidgetContent, WidgetUtil } from "../../index";

export const __KEY_HANDLER_LIST__ = new Set<KeyHandler>;

export class KeyHandler {
    #keyList = new Set as Set<string>;
    #targetList = new Set as Set<WidgetContent>;
    #fnList = new Set as Set<KeyHandlerFunction>;
    constructor(...keys: string[]) {
        this.keys(...keys);
        __KEY_HANDLER_LIST__.add(this);
        this.add = this.add.bind(this);
    }

    add(): Set<WidgetContent>;
    add(...targets: WidgetContent[]): this
    add(...targets: WidgetContent[]) {
        if (!arguments.length) return this.#targetList;
        targets.forEach(target => this.#targetList.add(target));
        return this;
    }

    keys(): Set<string>;
    keys(...keys: string[]): this;
    keys(...keys: string[]) {
        if (!arguments.length) return this.#keyList;
        if (keys instanceof Array) keys.forEach(key => this.#keyList.add(key));
        else this.#keyList.add(keys);
        return this;
    }

    fn(): Set<KeyHandlerFunction>;
    fn(...fn: KeyHandlerFunction[]): this;
    fn(...fn: KeyHandlerFunction[]) {
        if (!arguments.length) return this.#fnList;
        fn.forEach(f => this.#fnList.add(f));
        return this;
    }

    static find(target: WidgetContent) {
        return Array.from(__KEY_HANDLER_LIST__).filter(handler => {
            return Array.from(handler.add()).includes(target);
        })
    }
}

export type KeyHandlerFunction = (action: KeyHandlerAction, event: KeyboardEvent, handler: KeyHandler) => void;
export enum KeyHandlerAction {
    KeyDown,
    KeyUp
}
window.addEventListener('keydown', (e) => {
    if ($k.disable) return;
    if (searchDisableList(e.target)) return;
    __KEY_HANDLER_LIST__.forEach(handler => {
        if (!Array.from(handler.keys()).includes(e.key)) return;
        const find = Array.from(handler.add()).filter(target => {
            if (target instanceof Widget) return target.isRendered();
            else return Widget.isRendered(target);
        });
        if (!find.length) return;
        if (find) handler.fn().forEach(fn => fn(KeyHandlerAction.KeyDown, e, handler));
    })
})

window.addEventListener('keyup', (e) => {
    if ($k.disable) return;
    if (searchDisableList(e.target)) return;
    __KEY_HANDLER_LIST__.forEach(handler => {
        if (!Array.from(handler.keys()).includes(e.key)) return;
        const find = Array.from(handler.add()).filter(target => {
            if (target instanceof Widget) return target.isRendered();
            else return Widget.isRendered(target);
        });
        if (!find.length) return;
        handler.fn().forEach(fn => fn(KeyHandlerAction.KeyUp, e, handler));
    })
})

export function $k(keys: Multable<string>, fn: KeyHandlerFunction) {
    keys = WidgetUtil.resolveMultable(keys);
    return new KeyHandler(...keys).fn(fn);
}

$k.disable = false;
$k.disableList = new Set<Widget | HTMLElement>();
WidgetUtil.autobind($k.disableList);
function searchDisableList(target: EventTarget | null) {
    if (!target || !(target instanceof HTMLElement)) return false;
    for (let member of Array.from($k.disableList)) {
        member = $w.dom(member);
        if (target === member || member.contains(target)) return true;
    }
    return false;
}