import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { automatoLanguage } from "./automato-mode";
import { linter, lintGutter } from "@codemirror/lint";
import { autocompletion } from "@codemirror/autocomplete";
import { compile } from "./compiler";
import { lexer, tokenIds } from "./lexer";
import { parser } from "./parser";
import { lineHighlightField, automatorHighlighter } from "./automator-highlighter";

function walkSuggestion(suggestion, prefix, output) {
  const hasAutocomplete = suggestion.$autocomplete &&
    suggestion.$autocomplete.startsWith(prefix) && suggestion.$autocomplete !== prefix;
  const isUnlocked = suggestion.$unlocked ? suggestion.$unlocked() : true;
  if (hasAutocomplete && isUnlocked) output.add(suggestion.$autocomplete);
  for (const s of suggestion.categoryMatches) {
    walkSuggestion(tokenIds[s], prefix, output);
  }
}

const automatoCompletions = context => {
  const match = context.matchBefore(/\w+/);
  if (!match) return null;

  const line = context.state.doc.lineAt(context.pos);
  const lineStart = line.text.slice(0, match.from - line.from);

  const lineLex = lexer.tokenize(lineStart);
  if (lineLex.errors.length > 0) return null;

  const rawSuggestions = parser.computeContentAssist("command", lineLex.tokens);
  const suggestions = new Set();
  for (const s of rawSuggestions) {
    if (s.ruleStack[1] === "badCommand") continue;
    walkSuggestion(s.nextTokenType, match.text, suggestions);
  }

  return {
    from: match.from,
    options: Array.from(suggestions).map(label => ({ label, type: "keyword" })),
  };
};

const automatorTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--theme-automator-editor-background, #1e1e1e)",
    color: "var(--theme-automator-editor-text, #d4d4d4)",
  },
  ".cm-gutters": {
    backgroundColor: "var(--theme-automator-editor-gutters-background, #1e1e1e)",
    color: "var(--theme-automator-editor-gutters-text, #d4d4d4)",
  },
});

export function createEditor(doc, extensions) {
  const state = EditorState.create({
    doc,
    extensions: [
      automatoLanguage,
      lintGutter(),
      linter(view => {
        const { errors } = compile(view.state.doc.toString(), true);
        return errors.map(e => ({
          from: e.startOffset,
          to: e.endOffset + 1,
          severity: "error",
          message: e.info,
        }));
      }),
      autocompletion({ override: [automatoCompletions] }),
      automatorTheme,
      lineHighlightField,
      automatorHighlighter,
      EditorView.contentAttributes.of({ "aria-label": "Script editor" }),
      ...extensions
    ],
  });

  const view = new EditorView({
    state,
  });

  return view;
}
