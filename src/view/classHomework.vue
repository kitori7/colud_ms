<template>
  <div class="class-homework">
    <div class="done-box">
      <el-button
        style="float: right; transform: translate(-30px, 5px)"
        type="primary"
        v-if="isTeacher"
        @click="homeworkOpen(false)"
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
      <div
        class="item"
        :class="{ active: item.completeStatus === '已完成' }"
        @click="toUseHomework(item.id)"
        v-for="item in List"
      >
        <div class="item-img"><span>作业</span></div>
        <div class="item-content">
          <div>{{ item.homeworkName }}</div>
          <div>作答时间：{{ item.startTime }} 至 {{ item.endTime }}</div>
          <div class="item-type" v-if="!isTeacher">
            {{ item.completeStatus }}
          </div>
          {{ item.status === "1" ? "" : "作业已被禁用" }}
        </div>
        <div class="btn-content" v-if="isTeacher">
          <el-button @click.stop="homeworkOpen(true, item)">修改作业</el-button>
          <el-button type="primary" @click.stop="toStudentList(item.id)"
            >批改作业</el-button
          >
        </div>
      </div>
    </div>
    <homeworkDialog
      ref="homeworkDialogRef"
      @update="getList(Number(id))"
    ></homeworkDialog>
  </div>
</template>

<script lang="ts">
import { useRouter, useRoute } from "vue-router";
import { defineComponent, ref, Ref } from "vue";
import { useMain } from "@/store/home";
import { getHomeWork } from "@/request/api";
import homeworkDialog, { IHomeworkForm } from "@/components/homeworkDialog.vue";
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
    const toUseHomework = (homeworkId: number) => {
      if (isTeacher) {
        const url = router.resolve({
          path: `/use-homework/${id}/${homeworkId}`,
        });
        window.open(url.href, "_blank");
      } else {
        const url = router.resolve({
          path: `/do-homework/${id}/${homeworkId}`,
        });
        window.open(url.href, "_blank");
      }
    };
    const toStudentList = (homeworkId: number) => {
      const url = router.resolve({
        path: `/student-list/${id}/${homeworkId}`,
      });
      window.open(url.href, "_blank");
    };
    //初始化
    const List = ref<IHomeworkForm[]>([]);
    const getList = async (id: number) => {
      const res = (await getHomeWork(id)).data;
      List.value = res.data;
      store.homeworkList = List.value;
    };
    getList(Number(id));
    //作业对话框
    const homeworkDialogRef = ref();
    const homeworkOpen = (isChange: boolean, item?: IHomeworkForm) => {
      if (isChange) {
        homeworkDialogRef.value.onOpen(isChange, item);
      } else {
        homeworkDialogRef.value.onOpen(isChange);
      }
    };
    //修改作业
    return {
      toUseHomework,
      toStudentList,
      isTeacher,
      List,
      homeworkDialogRef,
      homeworkOpen,
      id,
      getList,
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
      justify-content: space-between;
      border-bottom: 1px solid #c5c6c6;
      cursor: pointer;
      &.active {
        .item-img {
          span {
            background-color: #6afaf5;
            font-weight: 700;
          }
        }
        .item-type {
          color: #6afaf5;
        }
      }
      .item-img {
        width: 60px;
        span {
          display: inline-block;
          height: 60px;
          width: 60px;
          background-color: #888;
          color: #fff;
          border-radius: 5px;
          text-align: center;
          line-height: 60px;
          font-size: 20px;
        }
      }
      .item-content {
        margin-left: 20px;
        flex: 1;
        text-align-last: left;
        div {
          line-height: 21px;
          font-size: 12px;
        }
        div:nth-child(1) {
          font-size: 18px;
        }
      }
      .btn-content {
        width: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
