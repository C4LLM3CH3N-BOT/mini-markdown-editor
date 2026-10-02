// 编辑器内容状态管理
import { reactive, toRefs } from "vue";

const state = reactive({
  content: "",
  editorView: null,
  previewView: null,
  scrollWrapper: "editor",
});

export function useEditorContentStore() {
  const setContent = (value) => {
    state.content = value;
  };

  const setEditorView = (view) => {
    state.editorView = view;
  };

  const setPreviewView = (element) => {
    state.previewView = element;
  };

  const setScrollWrapper = (wrapper) => {
    state.scrollWrapper = wrapper;
  };

  const syncScroll = (source) => {
    const { editorView, previewView, scrollWrapper } = state;
    
    if (!editorView || !previewView || source !== scrollWrapper) return;

    if (source === "editor") {
      const editorScroller = editorView.dom.querySelector(".cm-scroller");
      if (editorScroller && previewView) {
        const editorScrollTop = editorScroller.scrollTop;
        const editorScrollHeight = editorScroller.scrollHeight - editorScroller.clientHeight;
        const previewScrollHeight = previewView.scrollHeight - previewView.clientHeight;
        
        if (editorScrollHeight > 0 && previewScrollHeight > 0) {
          const scrollPercent = editorScrollTop / editorScrollHeight;
          previewView.scrollTop = scrollPercent * previewScrollHeight;
        }
      }
    } else if (source === "preview") {
      const editorScroller = editorView.dom.querySelector(".cm-scroller");
      if (editorScroller && previewView) {
        const previewScrollTop = previewView.scrollTop;
        const previewScrollHeight = previewView.scrollHeight - previewView.clientHeight;
        const editorScrollHeight = editorScroller.scrollHeight - editorScroller.clientHeight;
        
        if (editorScrollHeight > 0 && previewScrollHeight > 0) {
          const scrollPercent = previewScrollTop / previewScrollHeight;
          editorScroller.scrollTop = scrollPercent * editorScrollHeight;
        }
      }
    }
  };

  return {
    ...toRefs(state),
    setContent,
    setEditorView,
    setPreviewView,
    setScrollWrapper,
    syncScroll,
  };
}
