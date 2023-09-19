import { DivisionWidget } from "../../components/DivisionWidget";
export declare class EditorWidget extends DivisionWidget {
    constructor();
    readonly history: {
        back: EditHistory[];
        forward: EditHistory[];
    };
    addParagraph(): void;
    undo(): void;
    get paragraphs(): HTMLParagraphElement[];
    private _build_;
    private _listen_;
}
export declare class Line extends DivisionWidget {
    constructor();
    focus(): this;
}
interface EditHistory {
    col: number;
    line: number;
    content: string;
}
export {};
