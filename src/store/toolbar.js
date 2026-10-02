// 工具栏状态管理
import { reactive, toRefs } from "vue";

const toolbarState = reactive({
  isFullscreen: false,
  showLayout: "split", // 'split', 'editor', 'preview'
});

export function useToolbarStore() {
  const setFullscreen = (value) => {
    toolbarState.isFullscreen = value;
  };

  const setShowLayout = (layout) => {
    toolbarState.showLayout = layout;
  };

  return {
    ...toRefs(toolbarState),
    setFullscreen,
    setShowLayout,
  };
}
