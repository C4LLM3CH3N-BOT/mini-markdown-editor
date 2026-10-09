<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <el-tooltip content="标题" placement="bottom">
        <el-button size="small" @click="insertHeading">H</el-button>
      </el-tooltip>
      <el-tooltip content="加粗" placement="bottom">
        <el-button size="small" @click="insertBold">B</el-button>
      </el-tooltip>
      <el-tooltip content="斜体" placement="bottom">
        <el-button size="small" @click="insertItalic"><i>I</i></el-button>
      </el-tooltip>
      <el-tooltip content="删除线" placement="bottom">
        <el-button size="small" @click="insertDelete"><s>S</s></el-button>
      </el-tooltip>
      <el-divider direction="vertical" />
      <el-tooltip content="链接" placement="bottom">
        <el-button size="small" @click="insertLink">🔗</el-button>
      </el-tooltip>
      <el-tooltip content="图片" placement="bottom">
        <el-button size="small" @click="insertImage">🖼️</el-button>
      </el-tooltip>
      <el-tooltip content="行内代码" placement="bottom">
        <el-button size="small" @click="insertCode">`</el-button>
      </el-tooltip>
      <el-divider direction="vertical" />
      <el-tooltip content="有序列表" placement="bottom">
        <el-button size="small" @click="insertOl">1.</el-button>
      </el-tooltip>
      <el-tooltip content="无序列表" placement="bottom">
        <el-button size="small" @click="insertUl">-</el-button>
      </el-tooltip>
      <el-tooltip content="引用" placement="bottom">
        <el-button size="small" @click="insertBlockquote">"</el-button>
      </el-tooltip>
      <el-tooltip content="表格" placement="bottom">
        <el-button size="small" @click="insertTable">⊞</el-button>
      </el-tooltip>
    </div>
    <div class="toolbar-right">
      <el-tooltip :content="isDark ? '日间模式' : '夜间模式'" placement="bottom">
        <el-button size="small" text @click="themeStore.toggleMode">
          <el-icon>
            <component :is="isDark ? Sunny : Moon" />
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip content="切换布局" placement="bottom">
        <el-button size="small" @click="toggleLayout">📐</el-button>
      </el-tooltip>
      <el-tooltip content="全屏" placement="bottom">
        <el-button size="small" @click="toggleFullscreen">⛶</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { Sunny, Moon } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { useEditorContentStore } from "../store/editor";
import { useToolbarStore } from "../store/toolbar";
import { useThemeStore } from "../store/theme";

const { editorView } = storeToRefs(useEditorContentStore());
const toolbarStore = useToolbarStore();
const { isFullscreen, showLayout } = storeToRefs(toolbarStore);
const { setFullscreen, setShowLayout } = toolbarStore;
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

const insertText = (before, after = "") => {
  if (!editorView.value) return;
  const state = editorView.value.state;
  const selection = state.selection.main;
  const selectedText = state.sliceDoc(selection.from, selection.to);
  const newText = before + selectedText + after;

  editorView.value.dispatch({
    changes: { from: selection.from, to: selection.to, insert: newText },
    selection: { anchor: selection.from + before.length + selectedText.length + after.length },
  });
  editorView.value.focus();
};

const insertHeading = () => insertText("## ", "");
const insertBold = () => insertText("**", "**");
const insertItalic = () => insertText("*", "*");
const insertDelete = () => insertText("~~", "~~");
const insertLink = () => insertText("[", "](url)");
const insertImage = () => insertText("![alt](", ")");
const insertCode = () => insertText("`", "`");
const insertOl = () => insertText("1. ", "");
const insertUl = () => insertText("- ", "");
const insertBlockquote = () => insertText("> ", "");
const insertTable = () => insertText("\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n", "");

const toggleLayout = () => {
  const layouts = ["split", "editor", "preview"];
  const currentIndex = layouts.indexOf(showLayout.value);
  const nextIndex = (currentIndex + 1) % layouts.length;
  setShowLayout(layouts[nextIndex]);
};

const toggleFullscreen = () => {
  setFullscreen(!isFullscreen.value);
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-panel-muted);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
