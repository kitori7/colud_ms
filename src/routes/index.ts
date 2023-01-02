import { createRouter, createWebHistory } from "vue-router";

import error from "@/view/errorView.vue";
import home from "@/view/home.vue";
let routes = [
  {
    path: "/",
    name: "home",
    component: home,
  },
  {
    //配置404页面
    path: "/:catchAll(.*)",
    name: "404",
    component: error,
  },
];
// 路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 导出
export default router;