import { DivisionWidget } from "../../components/DivisionWidget";
import { SpanWidget } from "../../components/SpanWidget";
export class EditorWidget extends DivisionWidget {
    constructor() {
        super();
        this.history = {
            back: [],
            forward: []
        };
        this.editable('plaintext-only');
        this.class('editor-widget');
        this._listen_();
        this._build_();
    }
    addParagraph() {
        const paragraph = new Line;
        this.insert(paragraph);
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(paragraph.element, 0);
        // range.collapse(true)
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        selection === null || selection === void 0 ? void 0 : selection.addRange(range);
    }
    undo() {
        const lastHistory = this.history.back.pop();
        if (lastHistory)
            this.history.forward.push(lastHistory);
    }
    get paragraphs() {
        return Array.from(this.element.getElementsByTagName('p'));
    }
    _build_() {
        this.addParagraph();
    }
    _listen_() {
        this.setListener('keydown', e => {
            var _a, _b, _c;
            if (e.key === 'Enter') {
                e.preventDefault();
                const selection = window.getSelection();
                selection === null || selection === void 0 ? void 0 : selection.deleteFromDocument();
                this.addParagraph();
            }
            if (e.key === 'Backspace' && this.paragraphs.length === 1 && this.paragraphs[0].innerText === '\n')
                e.preventDefault();
            if (e.key === '@') {
                const selection = window.getSelection();
                const range = selection === null || selection === void 0 ? void 0 : selection.getRangeAt(0);
                const cursorPosition = range === null || range === void 0 ? void 0 : range.endOffset;
                range === null || range === void 0 ? void 0 : range.collapse(false);
                const beforeRange = document.createRange();
                beforeRange.setStart(range === null || range === void 0 ? void 0 : range.startContainer, 0);
                beforeRange.setEnd(range === null || range === void 0 ? void 0 : range.endContainer, range === null || range === void 0 ? void 0 : range.startOffset);
                console.debug(cursorPosition, beforeRange.toString().length);
                if (!beforeRange.toString().endsWith(' ') || beforeRange.toString().length === 0)
                    return;
                e.preventDefault();
                const text = new SpanWidget().content('@').element;
                range === null || range === void 0 ? void 0 : range.insertNode(text);
                range === null || range === void 0 ? void 0 : range.setStartAfter(text);
                range === null || range === void 0 ? void 0 : range.collapse(true);
            }
            if (e.key === ' ') {
                const selection = window.getSelection();
                console.debug(selection);
                if (((_b = (_a = selection === null || selection === void 0 ? void 0 : selection.anchorNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.nodeName) === 'SPAN') {
                    e.preventDefault();
                    const paragraph = (_c = selection.anchorNode.parentElement) === null || _c === void 0 ? void 0 : _c.parentElement;
                    const insertNode = new Text(' ');
                    paragraph === null || paragraph === void 0 ? void 0 : paragraph.append(insertNode);
                    selection.setPosition(insertNode, 1);
                }
            }
            if (e.key === 'z' && e.ctrlKey) {
                e.preventDefault();
            }
        });
        new MutationObserver((mutations) => {
            mutations.forEach((record, index, arr) => {
                if (record.type !== 'characterData')
                    return;
            });
        }).observe(this.element, { characterData: true, childList: true, subtree: true });
    }
}
export class Line extends DivisionWidget {
    constructor() {
        super();
        this.class('line');
    }
    focus() {
        this.element;
        return this;
    }
}
//# sourceMappingURL=EditorWidget.js.map