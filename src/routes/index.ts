import { createRouter, createWebHistory } from "vue-router";

import error from "@/view/errorView.vue";
import home from "@/view/home.vue";
import login from "@/view/login.vue";
import register from "@/view/register.vue";
import index from "@/view/index.vue";
import classMenu from "@/view/classMenu.vue";
import classCourse from "@/view/classCourse.vue";
import classHomework from "@/view/classHomework.vue";
import classData from "@/view/classData.vue";
import classTest from "@/view/classTest.vue";
let routes = [
  {
    path: "/",
    name: "home",
    component: home,
    children: [
      {
        path: "",
        redirect: "/index",
      },
      {
        path: "/index",
        name: "index",
        component: index,
      },
      {
        path: "/class-menu",
        name: "classMenu",
        component: classMenu,
        children: [
          {
            path: "/class-menu",
            redirect: "/class-course",
          },
          {
            path: "/class-course",
            name: "classCourse",
            component: classCourse,
          },
          {
            path: "/class-homework",
            name: "classHomework",
            component: classHomework,
          },
          {
            path: "/class-data",
            name: "classData",
            component: classData,
          },
          {
            path: "/class-test",
            name: "classTest",
            component: classTest,
          },
        ],
      },
    ],
  },
  {
    //配置404页面
    path: "/:catchAll(.*)",
    name: "404",
    component: error,
  },
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/register",
    name: "register",
    component: register,
  },
];
// 路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});
// 导出
export default router;
