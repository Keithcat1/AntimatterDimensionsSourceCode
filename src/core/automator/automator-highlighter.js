import { StateField, StateEffect } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";

const lineHighlightEffect = StateEffect.define();

export const lineHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(lines, tr) {
    lines = lines.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(lineHighlightEffect)) {
        lines = e.value;
      }
    }
    return lines;
  },
  provide: f => EditorView.decorations.from(f)
});

export const automatorHighlighter = EditorView.updateListener.of(update => {
  if (update.docChanged) {
    AutomatorHighlighter.clearAllHighlightedLines();
  }
});

export function highlightLine(view, line, type) {
  const effects = [];
  const currentDecorations = view.state.field(lineHighlightField);
  let newDecorations = [];
  currentDecorations.between(0, view.state.doc.length, (from, to, value) => {
    if (value.spec.class.includes(type)) return;
    newDecorations.push({ from, to, value });
  });

  if (line > 0) {
    const lineInfo = view.state.doc.line(line);
    newDecorations.push(Decoration.line({ class: `c-automator-editor__${type}-line` }).range(lineInfo.from));
  }

  effects.push(lineHighlightEffect.of(Decoration.set(newDecorations)));
  view.dispatch({ effects });
}
