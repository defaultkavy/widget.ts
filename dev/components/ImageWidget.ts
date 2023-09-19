import { Widget, WidgetOptions } from "./Widget";

export class ImageWidget extends Widget {
    override readonly dom: HTMLImageElement = this.dom;
    anchor: [number, number] = [0.5, 0.5];
    constructor(options?: ImageWidgetBuildOptions) {
        super({...options, tagName: 'img'})
        if (options) this.options(options);
    }
    
    src(): string
    src(content?: ImageContent, dimension?: Dimension): this;
    src(content?: ImageContent, dimension?: Dimension): this | string {
        if (!arguments.length) return this.dom.src;
        if (content === undefined) return this;
        if (content instanceof File) {
            const reader = new FileReader();
            reader.readAsDataURL(content)
            reader.onload = (e) => {
                if (dimension) 
                    ImageWidget.imageResizer(reader.result!.toString(), dimension).then(url => this.dom.src = url);
                else this.dom.src = reader.result!.toString();
            }
        } else {
            if (!content.length) this.dom.removeAttribute('src');
            else if (dimension) ImageWidget.imageResizer(content, dimension).then(url => this.dom.src = url);
            else this.dom.src = content;
        }
        return this;
    }

    loading(): string;
    loading(type: 'eager' | 'lazy'): this;
    loading(type?: 'eager' | 'lazy'): this | string {
        if (!arguments.length) return this.dom.loading;
        if (typeof type === 'string') this.dom.loading = type;
        return this;
    }

    set asset(asset: ImageAssetOptions) {
        this.dom.src = asset.url;
        if (asset.anchor) this.anchor = asset.anchor;
    }

    options(options: ImageWidgetBuildOptions): this {
        super.options(options);
        this.dom.src = options.url;
        if (options.alt) this.dom.alt = options.alt;
        if (options.anchor) this.anchor = options.anchor;
        if (options.lazyload) this.dom.loading = 'lazy';
        if (options.width) this.dom.width = options.width;
        if (options.height) this.dom.height = options.height;
        return this;
    }

    /**
     * ### Create multiple image widget in array.
     * 
     * An image widget builder.
     * @param list - Array of {@link ImageWidgetBuildOptions}
     * @returns Array of {@link ImageWidget}
     */
    static Builder(list: ImageWidgetBuildOptions[]) {
        return list.map(options => new this(options));
    }

    static async imageResizer(src: string | File, dimension: Dimension): Promise<string> {
        return new Promise(resolve => {
            const img = document.createElement('img');
            if (src instanceof File) {
                const reader = new FileReader();
                reader.readAsDataURL(src)
                reader.onload = (e) => {
                    img.src = reader.result!.toString();
                }
            } else img.src = src;
            img.crossOrigin = 'anonymous';
            img.addEventListener('load', e => {
                var canvas = document.createElement("canvas");
                let HEIGHT = img.height;
                let WIDTH = img.width;
                
                if (dimension.width) WIDTH = dimension.width;
                else {
                    if (!dimension.height) throw 'ImageWidget.imageResizer: height must be set when width is undefined';
                    WIDTH = (img.width / img.height) * dimension.height;
                }

                if (dimension.height) HEIGHT = dimension.height;
                else {
                    if (!dimension.width) throw 'ImageWidget.imageResizer: width must be set when height is undefined';
                    HEIGHT = (img.height / img.width) * dimension.width;
                }
                canvas.height = HEIGHT;
                canvas.width = WIDTH;
            
                const ctx = canvas.getContext("2d");
                ctx!.drawImage(img, 0, 0, WIDTH, HEIGHT);
                resolve(canvas.toDataURL("image/png"));
            })
        })
    }
}

export interface ImageWidgetBuildOptions extends WidgetOptions, ImageAssetOptions {
    lazyload?: boolean;
    width?: number;
    height?: number;
}

export interface ImageAssetOptions {
    url: string;
    anchor?: [number, number];
    alt?: string;
}

export type ImageContent = string | File;

export type Dimension = {
    width?: number;
    height?: number;
}