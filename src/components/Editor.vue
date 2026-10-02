<template>
  <div class="editor-scroll-wrapper">
    <div ref="editorRef" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { useEditorContentStore } from "../store/editor";

const editorRef = ref(null);
const editorView = ref(null);

const { content, setContent, setEditorView, syncScroll, setScrollWrapper } = useEditorContentStore();

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
      syntaxHighlighting(defaultHighlightStyle),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newContent = update.state.doc.toString();
          setContent(newContent);
          debouncedSave(newContent);
        }
      }),
      EditorView.theme({
        "&": { height: "100%" },
        ".cm-scroller": { overflow: "auto" },
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
