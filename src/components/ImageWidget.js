var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Widget } from "./Widget";
export class ImageWidget extends Widget {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { tagName: 'img' }));
        this.element = this.element;
        this.anchor = [0.5, 0.5];
        if (options)
            this.options(options);
    }
    src(content, dimension) {
        if (!arguments.length)
            return this.element.src;
        if (content === undefined)
            return this;
        if (content instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(content);
            reader.onload = (e) => {
                if (dimension)
                    ImageWidget.imageResizer(reader.result.toString(), dimension).then(url => this.element.src = url);
                else
                    this.element.src = reader.result.toString();
            };
        }
        else {
            if (!content.length)
                this.element.removeAttribute('src');
            else if (dimension)
                ImageWidget.imageResizer(content, dimension).then(url => this.element.src = url);
            else
                this.element.src = content;
        }
        return this;
    }
    set asset(asset) {
        this.element.src = asset.url;
        if (asset.anchor)
            this.anchor = asset.anchor;
    }
    options(options) {
        super.options(options);
        this.element.src = options.url;
        if (options.alt)
            this.element.alt = options.alt;
        if (options.anchor)
            this.anchor = options.anchor;
        if (options.lazyload)
            this.element.loading = 'lazy';
        if (options.width)
            this.element.width = options.width;
        if (options.height)
            this.element.height = options.height;
        return this;
    }
    /**
     * ### Create multiple image widget in array.
     *
     * An image widget builder.
     * @param list - Array of {@link ImageWidgetBuildOptions}
     * @returns Array of {@link ImageWidget}
     */
    static Builder(list) {
        return list.map(options => new this(options));
    }
    static imageResizer(src, dimension) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const img = document.createElement('img');
                if (src instanceof File) {
                    const reader = new FileReader();
                    reader.readAsDataURL(src);
                    reader.onload = (e) => {
                        img.src = reader.result.toString();
                    };
                }
                else
                    img.src = src;
                img.crossOrigin = 'anonymous';
                img.addEventListener('load', e => {
                    var canvas = document.createElement("canvas");
                    let HEIGHT = img.height;
                    let WIDTH = img.width;
                    if (dimension.width)
                        WIDTH = dimension.width;
                    else {
                        if (!dimension.height)
                            throw 'ImageWidget.imageResizer: height must be set when width is undefined';
                        WIDTH = (img.width / img.height) * dimension.height;
                    }
                    if (dimension.height)
                        HEIGHT = dimension.height;
                    else {
                        if (!dimension.width)
                            throw 'ImageWidget.imageResizer: width must be set when height is undefined';
                        HEIGHT = (img.height / img.width) * dimension.width;
                    }
                    canvas.height = HEIGHT;
                    canvas.width = WIDTH;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
                    resolve(canvas.toDataURL("image/png"));
                });
            });
        });
    }
}
//# sourceMappingURL=ImageWidget.js.map