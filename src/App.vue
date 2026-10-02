<template>
  <div class="app-wrapper">
    <EditorWrapper />
  </div>
</template>

<script setup>
import EditorWrapper from "./components/EditorWrapper.vue";
</script>

<style>
.app-wrapper {
  width: 100%;
  height: 95vh;
  background-color: var(--color-app-bg);
  padding: 50px;
}
</style>
