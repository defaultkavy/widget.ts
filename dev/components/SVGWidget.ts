import { Widget } from "../index";

export class SVGWidget extends Widget {
    readonly dom = super.dom as HTMLElement & SVGSVGElement;
    constructor() {
        super({tagName: 'svg'})
    }

    src(src: string) {
        fetch(src).then(res => res.text().then(html => {
            const svg = new DOMParser().parseFromString(html, 'image/svg+xml').querySelector('svg');
            if (!svg) return;
            Array.from(this.dom.attributes).forEach(attr => svg.setAttribute(attr.name, attr.value))
            this.dom.parentElement?.replaceChild(svg, this.dom);
            //@ts-expect-error
            this.dom = svg;
        }));

        return this;
    }
} 