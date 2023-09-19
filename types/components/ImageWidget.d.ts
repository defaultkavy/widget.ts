import { Widget, WidgetOptions } from "./Widget";
export declare class ImageWidget extends Widget {
    readonly element: HTMLImageElement;
    anchor: [number, number];
    constructor(options?: ImageWidgetBuildOptions);
    src(): string;
    src(content?: ImageContent, dimension?: Dimension): this;
    set asset(asset: ImageAssetOptions);
    options(options: ImageWidgetBuildOptions): this;
    /**
     * ### Create multiple image widget in array.
     *
     * An image widget builder.
     * @param list - Array of {@link ImageWidgetBuildOptions}
     * @returns Array of {@link ImageWidget}
     */
    static Builder(list: ImageWidgetBuildOptions[]): ImageWidget[];
    static imageResizer(src: string | File, dimension: Dimension): Promise<string>;
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
};
