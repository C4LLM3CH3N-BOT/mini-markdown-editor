// 编辑器内容状态管理
import { ref } from "vue";
import { defineStore } from "pinia";

export const useEditorContentStore = defineStore("editor", () => {
  const content = ref("");
  const editorView = ref(null);
  const previewView = ref(null);
  const scrollWrapper = ref("editor");

  const setContent = (value) => {
    content.value = value;
  };

  const setEditorView = (view) => {
    editorView.value = view;
  };

  const setPreviewView = (element) => {
    previewView.value = element;
  };

  const setScrollWrapper = (wrapper) => {
    scrollWrapper.value = wrapper;
  };

  const syncScroll = (source) => {
    if (!editorView.value || !previewView.value || source !== scrollWrapper.value) return;

    if (source === "editor") {
      const editorScroller = editorView.value.dom.querySelector(".cm-scroller");
      if (editorScroller && previewView.value) {
        const editorScrollTop = editorScroller.scrollTop;
        const editorScrollHeight = editorScroller.scrollHeight - editorScroller.clientHeight;
        const previewScrollHeight = previewView.value.scrollHeight - previewView.value.clientHeight;

        if (editorScrollHeight > 0 && previewScrollHeight > 0) {
          const scrollPercent = editorScrollTop / editorScrollHeight;
          previewView.value.scrollTop = scrollPercent * previewScrollHeight;
        }
      }
    } else if (source === "preview") {
      const editorScroller = editorView.value.dom.querySelector(".cm-scroller");
      if (editorScroller && previewView.value) {
        const previewScrollTop = previewView.value.scrollTop;
        const previewScrollHeight = previewView.value.scrollHeight - previewView.value.clientHeight;
        const editorScrollHeight = editorScroller.scrollHeight - editorScroller.clientHeight;

        if (editorScrollHeight > 0 && previewScrollHeight > 0) {
          const scrollPercent = previewScrollTop / previewScrollHeight;
          editorScroller.scrollTop = scrollPercent * editorScrollHeight;
        }
      }
    }
  };

  return {
    content,
    editorView,
    previewView,
    scrollWrapper,
    setContent,
    setEditorView,
    setPreviewView,
    setScrollWrapper,
    syncScroll,
  };
});
