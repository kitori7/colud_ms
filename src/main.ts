import { createApp } from "vue";
import App from "@/App.vue";
//路由
import router from "@/routes";
//pinia
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";
const pinia = createPinia().use(piniaPluginPersist);
//elementPlus
import ElementPlus from "element-plus";

import "element-plus/dist/index.css";
createApp(App).use(ElementPlus).use(router).use(pinia).mount("#app");
