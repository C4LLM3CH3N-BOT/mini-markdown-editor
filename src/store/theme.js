// 主题状态管理（Pinia）
import { ref, computed } from "vue";
import { defineStore } from "pinia";

const THEME_STORAGE_KEY = "mini-markdown-theme";

let mediaQuery = null;

const loadStoredMode = () => {
  if (typeof localStorage === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(THEME_STORAGE_KEY))?.mode ?? null;
  } catch {
    return null;
  }
};

const saveStoredMode = (mode) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode }));
  } catch {
    // 忽略存储失败（隐私模式等）
  }
};

export const useThemeStore = defineStore("theme", () => {
  const mode = ref("light"); // 当前主题：'light' 或 'dark'
  const isDark = computed(() => mode.value === "dark");

  // 操作 DOM 根节点：只在 <html> 上加类名，所有组件颜色随 CSS 变量自动切换
  const applyTheme = (value = mode.value) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = value;
    root.classList.toggle("dark", value === "dark");
  };

  const setMode = (value) => {
    const normalized = value === "dark" ? "dark" : "light";
    if (mode.value === normalized) {
      applyTheme(normalized);
      return;
    }
    mode.value = normalized;
    applyTheme(normalized); // 状态变了，立刻操作 DOM
    saveStoredMode(normalized);
  };

  const toggleMode = () => {
    setMode(mode.value === "dark" ? "light" : "dark");
  };

  // 用户没手动选过主题时才跟随系统
  const handleSystemChange = (event) => {
    if (loadStoredMode() !== null) return;
    mode.value = event.matches ? "dark" : "light";
    applyTheme();
  };

  // 首次加载初始化，避免闪屏
  const initialize = () => {
    // 1. 优先读 localStorage（用户上次选的）
    const storedMode = loadStoredMode();

    // 2. 没有记录 → 检测系统偏好
    if (storedMode === "light" || storedMode === "dark") {
      mode.value = storedMode;
    } else {
      const prefersDark =
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      mode.value = prefersDark ? "dark" : "light";
    }

    applyTheme();

    // 3. 监听系统主题变化
    if (typeof window !== "undefined" && window.matchMedia) {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (mediaQuery?.addEventListener) {
        mediaQuery.addEventListener("change", handleSystemChange);
      } else if (mediaQuery?.addListener) {
        mediaQuery.addListener(handleSystemChange);
      }
    }
  };

  return { mode, isDark, setMode, toggleMode, initialize };
});
