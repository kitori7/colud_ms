<template>
  <div class="class-homework">
    <div class="done-box">
      <el-button
        style="float: right; transform: translate(-30px, 5px)"
        type="primary"
        v-if="isTeacher"
        @click="homeworkOpen"
        >添加作业</el-button
      >
    </div>
    <div class="item-box">
      <span class="title" v-if="!isTeacher"
        >筛选<span class="title-item">
          <span class="round active-round"></span>
          <span>已完成</span>
        </span>
        <span class="title-item">
          <span class="round"></span>
          <span>未完成</span>
        </span></span
      >
      <div class="item active" @click="toUseHomework">
        <div class="item-img">作业</div>
        <div class="item-content">
          <div>作业名称</div>
          <div>作答时间：2023-03-29 21:29 至 2023-03-35 21:22</div>
          <div class="item-type" v-if="!isTeacher">未完成</div>
        </div>
      </div>
    </div>
    <homeworkDialog ref="homeworkDialogRef"></homeworkDialog>
  </div>
</template>

<script lang="ts">
import { useRouter, useRoute } from "vue-router";
import { defineComponent, ref, Ref } from "vue";
import { useMain } from "@/store/home";
import { getHomeWork } from "@/request/api";
import homeworkDialog from "@/components/homeworkDialog.vue";
export default defineComponent({
  name: "classHomework",
  components: {
    homeworkDialog,
  },
  setup() {
    //pinia
    const store = useMain();
    const { isTeacher } = store;
    //路由
    const router = useRouter();
    const route = useRoute();
    const { id } = route.params;
    const toUseHomework = () => {
      const url = router.resolve({
        path: "/use-homework",
      });
      window.open(url.href, "_blank");
    };
    //初始化
    const List = ref([]);
    const getList = async (id: number) => {
      const res = (await getHomeWork(id)).data;
      List.value = res.data;
    };
    getList(Number(id));
    //作业对话框
    const homeworkDialogRef = ref();
    const homeworkOpen = () => {
      homeworkDialogRef.value.onOpen();
    };
    return {
      toUseHomework,
      isTeacher,
      List,
      homeworkDialogRef,
      homeworkOpen,
    };
  },
});
</script>

<style lang="less">
.class-homework {
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  width: 100%;
  height: 86.6vh;
  background-color: #fff;
  padding: 0 20px;
  overflow: auto;
  .done-box {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c5c6c6;
  }
  .item-box {
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      color: #888;
      font-size: 12px;
      .title-item {
        margin-left: 20px;
      }
    }
    .item {
      height: 80px;
      display: flex;
      padding: 10px;
      border-bottom: 1px solid #c5c6c6;
      cursor: pointer;
      &.active {
        .item-img {
          background-color: #6afaf5;
          font-weight: 700;
        }
        .item-type {
          color: #6afaf5;
        }
      }
      .item-img {
        height: 60px;
        width: 60px;
        background-color: #888;
        color: #fff;
        border-radius: 5px;
        text-align: center;
        line-height: 60px;
        font-size: 20px;
      }
      .item-content {
        margin-left: 10px;
        div {
          line-height: 21px;
          font-size: 12px;
        }
        div:nth-child(1) {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
