<template>
  <div
    class="preview-wrapper"
    ref="previewRef"
    @scroll="handleScroll"
    @mouseenter="handleMouseEnter"
    v-html="htmlContent"
  ></div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { parseMarkdown, transformHtml } from "@mini-markdown-rc/ast-parser";
import { useEditorContentStore } from "../store/editor";

const previewRef = ref(null);

const { content, setPreviewView, setScrollWrapper, syncScroll } = useEditorContentStore();

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

const throttledSync = throttle(() => syncScroll("preview"), 50);

const htmlContent = computed(() => {
  if (!content.value) return "";
  try {
    const ast = parseMarkdown(content.value);
    return transformHtml(ast);
  } catch (e) {
    console.error("Parse error:", e);
    return "<p>Parse error</p>";
  }
});

watch(previewRef, (el) => {
  if (el) {
    setPreviewView(el);
  }
});

const handleScroll = (e) => {
  throttledSync();
};

const handleMouseEnter = () => {
  setScrollWrapper("preview");
};
</script>

<style scoped>
.preview-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
  word-wrap: break-word;
  color: var(--color-text-primary);
}

.preview-wrapper :deep(h1) {
  font-size: 2em;
  padding: 0 10px;
  border-left: 5px solid var(--color-heading-border);
  margin: 0.8em 0;
}

.preview-wrapper :deep(h2) {
  font-size: 1.5em;
  padding: 0 10px;
  border-left: 5px solid var(--color-heading-border);
  margin: 0.8em 0;
}

.preview-wrapper :deep(h3) {
  font-size: 1.25em;
  padding: 0 10px;
  border-left: 5px solid var(--color-heading-border);
  margin: 0.8em 0;
}

.preview-wrapper :deep(p) {
  line-height: 20px;
  font-size: 14px;
  margin: 0.8em 0;
}

.preview-wrapper :deep(code) {
  background-color: var(--color-code-bg);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.preview-wrapper :deep(pre) {
  background-color: var(--color-pre-bg);
  color: var(--color-pre-text);
  padding: 1em;
  border-radius: 5px;
  overflow: auto;
}

.preview-wrapper :deep(pre code) {
  background: none;
  padding: 0;
}

.preview-wrapper :deep(blockquote) {
  border-left: 5px solid var(--color-blockquote-border);
  margin: 20px 0;
  padding: 0 1.2em;
  color: var(--color-text-secondary);
}

.preview-wrapper :deep(a) {
  color: var(--color-link);
  text-decoration: none;
}

.preview-wrapper :deep(a:hover) {
  color: var(--color-link-hover);
}

.preview-wrapper :deep(ul) {
  padding-inline-start: 30px;
  margin: 0.6em 0;
}

.preview-wrapper :deep(li) {
  list-style: disc;
  margin: 0.3em 0;
}

.preview-wrapper :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 10px 0;
}

.preview-wrapper :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.preview-wrapper :deep(th),
.preview-wrapper :deep(td) {
  border: 1px solid var(--color-border-strong);
  padding: 8px;
  text-align: left;
}

.preview-wrapper :deep(th) {
  background-color: var(--color-table-header-bg);
}
</style>
