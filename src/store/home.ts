import { defineStore } from "pinia";
import type { IRuleForm } from "@/components/TestCart.vue";
import type { IPjt } from "@/view/classTest.vue";
import type { classInfo } from "@/view/index.vue";
export interface IUserInfo {
  entity?: "1" | "0";
  id?: string;
  nickName?: string;
  schoolName?: string;
  userName?: string;
  avatarPath?: string;
}

export const useMain = defineStore("main", {
  // 相当于data
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型,如果推断失败可以试下 as xxx
      isTeacher: true,
      userInfo: {} as IUserInfo,
      ruleForm: {} as IRuleForm,
      requestList: [] as Array<any>,
      classInfo: {} as classInfo,
      stuPodInfo: {} as IPjt,
      homeworkList: [] as any[],
    };
  },
  // 相当于计算属性
  getters: {},
  // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
  actions: {},
  //数据永久化
  persist: {
    enabled: true, //开启数据持久化
    strategies: [
      {
        key: "state", //给一个要保存的名称
        storage: localStorage, //sessionStorage / localStorage 存储方式
      },
    ],
  },
});
