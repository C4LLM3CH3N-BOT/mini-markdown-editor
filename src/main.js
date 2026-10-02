import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import App from "./App.vue";
import "./styles/reset.css";
import "./styles/theme.css";
import { useThemeStore } from "./store/theme";

const app = createApp(App);
app.use(ElementPlus);

const pinia = createPinia();
app.use(pinia);

// ⭐ 在挂载前初始化主题，避免闪屏
useThemeStore(pinia).initialize();

app.mount("#app");
