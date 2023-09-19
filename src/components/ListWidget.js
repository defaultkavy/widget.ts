import { WidgetManager } from "../structures/WidgetManager";
import { ListItemWidget } from "./ListItemWidget";
import { ParentWidget } from "./ParentWidget";
export class ListWidget extends ParentWidget {
    constructor(type, options) {
        super(Object.assign(Object.assign({}, options), { tagName: type }));
        this.element = this.element;
        this.listItems = new WidgetManager(this);
        this.itemMap = new Map;
    }
    item(item, position) {
        var _a;
        if (item instanceof Array)
            item.forEach(i => this.item(i));
        else {
            if (item === undefined)
                return this;
            const LIST_ITEM = (_a = this.itemMap.get(item)) !== null && _a !== void 0 ? _a : new ListItemWidget().bind(item);
            this.itemMap.set(item, LIST_ITEM);
            this.listItems.add(LIST_ITEM, position);
            this.insert(LIST_ITEM, position);
        }
        return this;
    }
    /**
     * Remove this widget. If specify resolver will remove the target item from list.
     * @param resolver Item or array of item. Leave blank to remove this widget.
     * @returns
     */
    remove(resolver) {
        if (!arguments.length)
            return super.remove();
        if (resolver instanceof Array)
            resolver.forEach(item => this.remove(item));
        else if (resolver !== undefined)
            this.listItems.delete(this.itemMap.get(resolver));
        return this;
    }
    sort(fn) {
        const ITEM_LIST = this.listItems.array.map(item => item.item);
        ITEM_LIST.sort(fn).forEach(item => this.item(item));
        return this;
    }
}
//# sourceMappingURL=ListWidget.js.map