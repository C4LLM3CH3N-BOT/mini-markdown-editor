<template>
  <div :class="['container', { 'md-editor-fullscreen': isFullscreen }]">
    <Toolbar />
    <div class="content-wrapper">
      <div v-show="showLayout !== 'preview'" class="editor-pane">
        <Editor />
      </div>
      <div v-show="showLayout !== 'editor'" class="preview-pane">
        <Preview />
      </div>
    </div>
    <Status />
  </div>
</template>

<script setup>
import Toolbar from "./Toolbar.vue";
import Editor from "./Editor.vue";
import Preview from "./Preview.vue";
import Status from "./Status.vue";
import { useToolbarStore } from "../store/toolbar";

const { isFullscreen, showLayout } = useToolbarStore();
</script>

<style scoped>
.container {
  width: 100%;
  min-width: 700px;
  max-width: 1200px;
  min-height: 500px;
  height: 100%;
  border: 1px solid var(--color-border);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: var(--color-panel);
}

.container.md-editor-fullscreen {
  position: fixed !important;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10000;
  width: auto !important;
  max-width: none !important;
  height: auto !important;
}

.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-pane,
.preview-pane {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.editor-pane {
  border-right: 1px solid var(--color-border);
}
</style>
