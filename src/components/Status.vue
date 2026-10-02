<template>
  <div class="status-bar">
    <span class="status-item">字数: {{ wordCount }}</span>
    <span class="status-item">行数: {{ lineCount }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useEditorContentStore } from "../store/editor";

const { content } = useEditorContentStore();

const wordCount = computed(() => {
  if (!content.value) return 0;
  return content.value.replace(/\s/g, "").length;
});

const lineCount = computed(() => {
  if (!content.value) return 0;
  return content.value.split("\n").length;
});
</script>

<style scoped>
.status-bar {
  display: flex;
  gap: 20px;
  padding: 6px 12px;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-panel-muted);
  font-size: 12px;
  color: var(--color-text-secondary);
}

.status-item {
  user-select: none;
}
</style>
