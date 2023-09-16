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
import useHomework from "@/view/useHomework.vue";
import textPage from "@/view/textPage.vue";
import videoClass from "@/view/videoClass.vue";
import studentList from "@/view/studentList.vue";
import doHomework from "@/view/doHomework.vue";
//路由守卫
import { useMain } from "@/store/home";

let routes = [
  {
    path: "/",
    name: "home",
    component: home,
    children: [
      {
        path: "",
        name: "none",
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
        redirect: "/class-course/:id",
        children: [
          {
            path: "/class-course/:id",
            name: "classCourse",
            component: classCourse,
          },
          {
            path: "/class-homework/:id",
            name: "classHomework",
            component: classHomework,
          },
          {
            path: "/class-data/:id",
            name: "classData",
            component: classData,
          },
          {
            path: "/class-test/:id",
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
  {
    path: "/use-homework/:courseId/:homeworkId",
    name: "useHomework",
    component: useHomework,
  },
  {
    path: "/do-homework/:courseId/:homeworkId",
    name: "doHomework",
    component: doHomework,
  },
  {
    path: "/student-list/:courseId/:homeworkId",
    name: "studentList",
    component: studentList,
  },
  {
    path: "/text-page/pjdId=:pjtId&podId=:podId",
    name: "textPage",
    component: textPage,
  },
  {
    path: "/video/:id/:courseId",
    name: "videoClass",
    component: videoClass,
  },
];
// 路由
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫;
router.beforeEach((to, from) => {
  if (to.path !== "/login") {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      return {
        path: "/login",
      };
    }
  }
});
// 导出
export default router;
