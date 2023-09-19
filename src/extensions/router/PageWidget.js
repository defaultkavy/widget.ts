var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _PageWidget_name;
import { ParentWidget } from "../../components/ParentWidget";
export class PageWidget extends ParentWidget {
    constructor(path, initFn) {
        super({ tagName: 'page' });
        _PageWidget_name.set(this, void 0);
        this.initialized = false;
        this.opened = false;
        this._listeners = {
            init: new Set,
            open: new Set,
            close: new Set,
            refresh: new Set
        };
        this.path = path;
        this.initFn = initFn;
    }
    /**
     * ### Page first load function
     * Run the page initialize function. Only work when the page first time load.
     * @returns {this}
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initialized) {
                yield this.initFn(this);
                this._listeners.init.forEach(fn => fn(this));
                this.initialized = true;
            }
            return this;
        });
    }
    name(name) {
        if (!arguments.length)
            return __classPrivateFieldGet(this, _PageWidget_name, "f");
        __classPrivateFieldSet(this, _PageWidget_name, name, "f");
        return this;
    }
    _open() {
        this._listeners.open.forEach(fn => fn(this));
        return this;
    }
    _close() {
        this._listeners.close.forEach(fn => fn(this));
        return this;
    }
    _refresh() {
        this._listeners.refresh.forEach(fn => fn(this));
        return this;
    }
    on(type, fn) {
        this._listeners[type].add(fn);
        return this;
    }
}
_PageWidget_name = new WeakMap();
//# sourceMappingURL=PageWidget.js.map