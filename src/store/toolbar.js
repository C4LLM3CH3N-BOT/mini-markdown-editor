// 工具栏状态管理
import { ref } from "vue";
import { defineStore } from "pinia";

export const useToolbarStore = defineStore("toolbar", () => {
  const isFullscreen = ref(false);
  const showLayout = ref("split"); // 'split', 'editor', 'preview'

  const setFullscreen = (value) => {
    isFullscreen.value = value;
  };

  const setShowLayout = (layout) => {
    showLayout.value = layout;
  };

  return { isFullscreen, showLayout, setFullscreen, setShowLayout };
});
