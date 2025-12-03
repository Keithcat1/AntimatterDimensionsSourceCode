<script>
import { createEditor } from "@/core/automator/automator-codemirror6";
import { EditorView, keymap } from "@codemirror/view";
import { Transaction, Compartment } from "@codemirror/state";

export default {
  name: "AutomatorTextEditor",
  props: {
    currentScriptId: {
      type: [Number, String],
      required: true
    },
  },
  data() {
    return {
      markedLineNumber: 0,
      unclearedLines: false,
      isActiveScript: false,
    };
  },
  computed: {
    UI() {
      AutomatorTextUI.initialize();
      return AutomatorTextUI;
    },
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
  },
  watch: {
    currentScriptId: {
      handler(id, oldId) {
        this.unmarkActiveLine();
        const storedScripts = player.reality.automator.scripts;
        if (!this.UI.documents[id] || this.UI.documents[id] !== storedScripts[id].content) {
          this.UI.documents[id] = storedScripts[id].content;
        }

        if (this.UI.editor) {
          const scrollTop = this.UI.editor.scrollDOM.scrollTop;
          this.UI.editor.dispatch({
            changes: { from: 0, to: this.UI.editor.state.doc.length, insert: this.UI.documents[id] },
            annotations: Transaction.userEvent.of("automator.load")
          });
          this.UI.editor.scrollDOM.scrollTop = scrollTop;
        }

        // When a script gets deleted, get rid of the old document object
        if (this.UI.documents[oldId] !== undefined && storedScripts[oldId] === undefined) {
          delete this.UI.documents[oldId];
        }
      },
      immediate: true,
    },
    fullScreen() {
      if (this.UI.editor) {
        this.UI.editor.dispatch({
          effects: this.UI.themeToggler.reconfigure(this.fullScreen ? this.UI.fullscreenTheme : [])
        });
      }
    }
  },
  created() {
    AutomatorTextUI.initialize();
    this.on$(GAME_EVENT.GAME_LOAD, () => this.onGameLoad());
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad());
  },
  mounted() {
    this.UI.view.dom.className = "c-automator-editor l-automator-editor l-automator-pane__content";
    this.$refs.container.appendChild(this.UI.view.dom);
    this.UI.editor.scrollDOM.scrollTop = AutomatorTextUI.savedVertPos;
  },
  beforeDestroy() {
    // This will stick around, otherwise
    AutomatorHighlighter.clearAllHighlightedLines();
    AutomatorTextUI.savedVertPos = this.UI.editor.scrollDOM.scrollTop;
    this.$refs.container.removeChild(this.UI.view.dom);
  },
  methods: {
    update() {
      AutomatorBackend.jumpToActiveLine();
      if (this.unclearedLines && !AutomatorBackend.isOn) this.clearAllActiveLines();
      if (AutomatorBackend.isOn) {
        this.setActiveState(`${AutomatorBackend.state.topLevelScript}`, AutomatorBackend.stack.top.lineNumber);
      } else {
        this.setActiveState("", -1);
      }
    },
    onGameLoad() {
      this.UI.documents = {};
    },
    unmarkActiveLine() {
      AutomatorHighlighter.updateHighlightedLine(-1, LineEnum.Active);
    },
    markActiveLine(lineNumber) {
      AutomatorHighlighter.updateHighlightedLine(lineNumber, LineEnum.Active);
      this.unclearedLines = true;
    },
    // This only runs when a script is interrupted and stops during execution because of the player editing the text
    clearAllActiveLines() {
      AutomatorHighlighter.clearAllHighlightedLines();
      this.unclearedLines = false;
    },
    setActiveState(scriptID, lineNumber) {
      if (`${this.currentScriptId}` === scriptID) this.markActiveLine(lineNumber);
      else this.unmarkActiveLine();
    },
  }
};

export const AutomatorTextUI = {
  documents: {},
  editor: null,
  view: null,
  themeToggler: null,
  fullscreenTheme: EditorView.theme({
    "&": { height: "100%" },
    ".cm-scroller": { overflow: "auto" }
  }),
  savedVertPos: 0,

  initialize() {
    if (this.view) return;
    this.setUpEditor();
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.documents = {});
  },
  setUpEditor() {
    this.themeToggler = new Compartment();
    const extensions = [
      EditorView.lineWrapping,
      keymap.of([
        { key: "Mod-z", run: () => { AutomatorData.undoScriptEdit(); return true; }, preventDefault: true },
        { key: "Mod-y", run: () => { AutomatorData.redoScriptEdit(); return true; }, preventDefault: true },
        { key: "Shift-Mod-z", run: () => { AutomatorData.redoScriptEdit(); return true; }, preventDefault: true }
      ]),
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const userEvent = update.transactions.some(t => t.isUserEvent("input") || t.isUserEvent("paste"));
          if (userEvent) {
            const scriptID = ui.view.tabs.reality.automator.editorScriptID;
            const scriptText = update.state.doc.toString();
            AutomatorBackend.saveScript(scriptID, scriptText);
            AutomatorData.recalculateErrors();
            const errors = AutomatorData.currentErrors().length;
            if (errors > update.state.doc.lines) SecretAchievement(48).unlock();
            AutomatorHighlighter.clearAllHighlightedLines();
          }
        }
      }),
      this.themeToggler.of([])
    ];
    this.view = createEditor("", extensions);
    this.editor = this.view;
  },
  clearEditor() {
    if (!this.editor) {
      this.setUpEditor();
    }
    this.editor.dispatch({
      changes: { from: 0, to: this.editor.state.doc.length, insert: "" }
    });
  },
};
</script>

<template>
  <div
    ref="container"
    class="c-automator-editor l-automator-editor l-automator-pane__content"
  />
</template>
