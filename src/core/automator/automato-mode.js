import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import { StreamLanguage } from "@codemirror/language";

const automatoMode = {
  // The start state contains the rules that are intially used
  start: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { regex: /studies\s+/ui, token: "keyword", next: "studiesArgs" },
    { regex: /blob\s\s/ui, token: "blob" },
    {
      regex: /(auto|if|pause|studies|time[ \t]+theorems?|space[ \t]+theorems?|until|wait|while|black[ \t]+hole|stored?[ \t]+game[ \t]+time|notify)\s/ui,
      token: "keyword",
      next: "commandArgs"
    },
    {
      regex: /stop/ui,
      token: "keyword",
      next: "commandDone"
    },
    {
      regex: /start\s|unlock\s/ui,
      token: "keyword",
      next: "startUnlock"
    },
    { regex: /infinity\S+|eternity\S+|reality\S+|pause\S+|restart\S+/ui, token: "error", next: "commandDone" },
    { regex: /infinity|eternity|reality/ui, token: "keyword", next: "prestige" },
    { regex: /pause|restart/ui, token: "keyword", next: "commandDone" },
    { regex: /\}/u, dedent: true },
    { regex: /\S+\s/ui, token: "error", next: "commandDone" },
  ],
  studiesArgs: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    { regex: /load(\s+|$)/ui, token: "variable-2", next: "studiesLoad" },
    { regex: /respec/ui, token: "variable-2", next: "commandDone" },
    { regex: /purchase/ui, token: "variable-2", next: "studiesList" },
    { regex: /nowait(\s+|$)/ui, token: "property" },
  ],
  studiesList: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    { regex: /(antimatter|infinity|time)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /(active|passive|idle)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /(light|dark)(?=[\s,|]|$)/ui, token: "number" },
    { regex: /([1-9][0-9]+)(?=[\s,!|-]|$)/u, token: "number" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable", next: "commandDone" },
    { regex: /!$/u, token: "variable-2" },
    { regex: /([1-9]|1[0-2])(?=!|$)/u, token: "number" },
  ],
  studiesLoad: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    { regex: /id(\s+|$)/ui, token: "variable-2", next: "studiesLoadId" },
    { regex: /name(\s+|$)/ui, token: "variable-2", next: "studiesLoadPreset" },
    { regex: /\S+/ui, token: "error" },
  ],
  studiesLoadId: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    { regex: /\d/u, token: "qualifier", next: "commandDone" },
  ],
  studiesLoadPreset: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    { regex: /(\/(?!\/)|[^\s#/])+/ui, token: "qualifier", next: "commandDone" },
  ],
  prestige: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    { regex: /nowait(\s|$)/ui, token: "property" },
    { regex: /respec/ui, token: "variable-2" },
  ],
  commandDone: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    // This seems necessary to have a closing curly brace de-indent automatically in some cases
    { regex: /\}/u, dedent: true },
    { regex: /\S+/ui, token: "error" },
  ],
  startUnlock: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    {
      regex: /ec\s?(1[0-2]|[1-9])|dilation/ui,
      token: "variable-2",
      next: "commandDone",
    },
    { regex: /nowait(\s|$)/ui, token: "property" },
  ],
  commandArgs: [
    { regex: /(\/\/|#).*/u, token: "comment", next: "start" },
    { sol: true, next: "start" },
    { regex: /<=|>=|<|>/u, token: "operator" },
    { regex: /nowait(\s|$)/ui, token: "property" },
    { regex: /".*"/u, token: "string", next: "commandDone" },
    { regex: /'.*'/u, token: "string", next: "commandDone" },
    { regex: /(on|off|bh1|bh2|dilation|load|respec)(\s|$)/ui, token: "variable-2" },
    { regex: /(eternity|reality|use)(\s|$)/ui, token: "variable-2" },
    { regex: /(antimatter|infinity|time)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /(active|passive|idle)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /(light|dark)(\s|$|(?=,))/ui, token: "variable-2" },
    { regex: /x[\t ]+highest(\s|$)/ui, token: "variable-2" },
    { regex: /pending[\t ]+(completions|ip|ep|tp|rm|glyph[\t ]+level)(\s|$)/ui, token: "variable-2" },
    { regex: /total[\t ]+(completions|tt|space theorems)(\s|$)/ui, token: "variable-2" },
    { regex: /spent[\t ]+tt(\s|$)/ui, token: "variable-2" },
    { regex: /filter[ \t]+score/ui, token: "variable-2" },
    { regex: /ec(1[0-2]|[1-9])[\t ]+completions(\s|$)/ui, token: "variable-2" },
    { regex: /(am|ip|ep|all)(\s|$)/ui, token: "variable-2" },
    {
      regex: /(rm|rg|dt|tp|tt|space theorems|(banked )?infinities|eternities|realities|rep(licanti)?)(\s|$)/ui,
      token: "variable-2",
    },
    { regex: / sec(onds ?) ?| min(utes ?) ?| hours ?/ui, token: "variable-2" },
    { regex: /([0-9]+:[0-5][0-9]:[0-5][0-9]|[0-5]?[0-9]:[0-5][0-9]|t[1-4])/u, token: "number" },
    { regex: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/ui, token: "number" },
    { regex: /[a-zA-Z_][a-zA-Z_0-9]*/u, token: "variable" },
    { regex: /\{/u, indent: true, next: "commandDone" },
    // This seems necessary to have a closing curly brace de-indent automatically in some cases
    { regex: /\}/u, dedent: true },
  ],

  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    lineComment: "//",
    electricChars: "}",
  }
};

export const automatoLanguage = StreamLanguage.define(simpleMode(automatoMode));
