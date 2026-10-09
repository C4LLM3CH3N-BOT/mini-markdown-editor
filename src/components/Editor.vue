<template>
  <div class="editor-scroll-wrapper">
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { syntaxHighlighting, defaultHighlightStyle, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { useEditorContentStore } from "../store/editor";
import { useThemeStore } from "../store/theme";
import { storeToRefs } from "pinia";

const editorRef = ref(null);
const editorView = ref(null);

const editorStore = useEditorContentStore();
const { setContent, setEditorView, syncScroll, setScrollWrapper } = editorStore;

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

// 用 Compartment 隔离 CodeMirror 主题，便于运行时在明暗间切换
const themeCompartment = new Compartment();

// 暗色高亮：结构与 defaultHighlightStyle 完全对齐，只换配色，避免切换主题时排版跳动
const darkHighlightStyle = HighlightStyle.define([
  { tag: tags.meta, color: "#8a9199" },
  { tag: tags.link, textDecoration: "underline" },
  { tag: tags.heading, textDecoration: "underline", fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  { tag: tags.keyword, color: "#c678dd" },
  { tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName], color: "#4da3ff" },
  { tag: [tags.literal, tags.inserted], color: "#95de64" },
  { tag: [tags.string, tags.deleted], color: "#e06c75" },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: "#d19a66" },
  { tag: tags.definition(tags.variableName), color: "#61afef" },
  { tag: tags.local(tags.variableName), color: "#56b6c2" },
  { tag: [tags.typeName, tags.namespace], color: "#98c379" },
  { tag: tags.className, color: "#e5c07b" },
  { tag: tags.definition(tags.propertyName), color: "#61afef" },
  { tag: tags.comment, color: "#7f848e" },
  { tag: tags.invalid, color: "#e06c75" },
]);

// 编辑器基础配色：背景/文字/光标/行号栏；dark 标志交给 CodeMirror 决定选区、当前行等默认色
const editorBaseTheme = (dark) =>
  EditorView.theme(
    {
      "&": {
        height: "100%",
        backgroundColor: dark ? "#1e1e1e" : "#ffffff",
        color: dark ? "#d4d4d4" : "#333333",
      },
      ".cm-scroller": { overflow: "auto" },
      ".cm-gutters": {
        backgroundColor: dark ? "#252525" : "#fafafa",
        color: dark ? "#6b7280" : "#999999",
        border: "none",
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: dark ? "#d4d4d4" : "#333333",
      },
    },
    { dark }
  );

const lightTheme = [editorBaseTheme(false), syntaxHighlighting(defaultHighlightStyle)];
const darkTheme = [editorBaseTheme(true), syntaxHighlighting(darkHighlightStyle)];

const loadContent = () => {
  try {
    return localStorage.getItem("mini-markdown-content") || "";
  } catch (e) {
    return "";
  }
};

const saveContent = (value) => {
  try {
    localStorage.setItem("mini-markdown-content", value);
  } catch (e) {
    console.warn("Failed to save content:", e);
  }
};

const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const debouncedSave = debounce(saveContent, 500);

const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
};

onMounted(() => {
  if (!editorRef.value) return;

  const state = EditorState.create({
    doc: loadContent(),
    extensions: [
      lineNumbers(),
      highlightActiveLine(),
      history(),
      markdown(),
      themeCompartment.of(isDark.value ? darkTheme : lightTheme),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newContent = update.state.doc.toString();
          setContent(newContent);
          debouncedSave(newContent);
        }
      }),
    ],
  });

  editorView.value = new EditorView({
    state,
    parent: editorRef.value,
  });

  setEditorView(editorView.value);

  const editorScroller = editorView.value.dom.querySelector(".cm-scroller");
  if (editorScroller) {
    const throttledSync = throttle(() => syncScroll("editor"), 50);
    editorScroller.addEventListener("scroll", throttledSync);
    editorScroller.addEventListener("mouseenter", () => {
      setScrollWrapper("editor");
    });
  }
});

watch(isDark, (dark) => {
  editorView.value?.dispatch({
    effects: themeCompartment.reconfigure(dark ? darkTheme : lightTheme),
  });
});

onUnmounted(() => {
  if (editorView.value) {
    editorView.value.destroy();
  }
});
</script>

<style scoped>
.editor-scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 5px 10px;
  box-sizing: border-box;
}

.editor-container {
  width: 100%;
  min-height: 100%;
  font-size: 16px;
  line-height: 24px;
}

.editor-container :deep(.cm-editor) {
  outline: none;
  height: 100%;
}

.editor-container :deep(.cm-editor.cm-focused) {
  outline: none;
}

.editor-container :deep(.cm-scroller) {
  height: 100%;
}
</style>
