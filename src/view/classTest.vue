<template>
  <div class="class-test">
    <div class="done-box">
      <el-button
        style="float: right; transform: translate(-30px, 5px)"
        type="primary"
        v-if="isTeacher"
        @click.stop="openDialog"
        >添加实训</el-button
      >
    </div>
    <el-empty description="暂无实训" v-if="List.length === 0"></el-empty>
    <div class="item-box" v-else>
      <div
        class="item"
        v-for="item in List"
        :key="item.pjtId"
        @click="onPjtList(item)"
      >
        <div class="item-img">
          <img src="../assets/img/computer.png" alt="" />
        </div>
        <div class="item-content">
          <div>{{ item.pjtName }}</div>
          <div>
            <span v-if="item.status === 2">实训已结束</span>
            <span v-if="item.description"> {{ item.description }}</span>
          </div>
          <div>作答时间：{{ item.startTime }} 至 {{ item.endTime }}</div>
        </div>
        <div class="item-btn" v-if="isTeacher">
          <span>
            <el-button
              @click.stop="changeStatus(item)"
              :disabled="item.status === 2"
              :type="item.status === 0 ? 'info' : 'success'"
              >{{ item.status === 0 ? "禁用实训" : "启用实训" }}</el-button
            ></span
          >
          <span>
            <el-button
              @click.stop="onInfo(item.pjtId)"
              :disabled="item.status === 2"
              >修改实训</el-button
            >
          </span>
        </div>
      </div>
    </div>
    <test-cart ref="dialog" :onOnCartClose="initData"></test-cart>
    <pod-list ref="podList"></pod-list>
  </div>
</template>

<script lang="ts">
import { useRouter, useRoute } from "vue-router";
import { defineComponent, ref, Ref, onMounted } from "vue";
import { useMain } from "@/store/home";
import TestCart from "@/components/TestCart.vue";
import podList from "@/components/podList.vue";
import {
  pjtTeaList,
  pjtStuList,
  getCreatePod,
  upPjtStatus,
} from "@/request/api";
import { ElLoading, ElMessage } from "element-plus";
export interface IPjt {
  count: number;
  description: string;
  endTime?: string;
  image: string;
  pjtId: number;
  pjtName: string;
  startTime: string;
  status: number;
  environment: string;
  existTime: number;
  limitsCpu: number;
  limitsMemory: number;
  requestsCpu: number;
  requestsMemory: number;
  podId?: number;
}
export default defineComponent({
  name: "classTest",
  components: {
    TestCart,
    podList,
  },
  setup() {
    //pinia
    const store = useMain();
    const { isTeacher } = store;
    //路由
    const router = useRouter();
    const route = useRoute();
    //卡片
    const dialog = ref();
    const openDialog = () => {
      if (store.classInfo.studentNumber === 0) {
        ElMessage.warning("学生数量为0，不能创建实训");
      } else {
        dialog.value.onOpen(0);
      }
    };
    const List: Ref<Array<IPjt>> = ref([]);
    //发请求
    onMounted(() => {
      initData();
    });
    const debounce = (fn: Function) => {
      let t: any = null;
      return function () {
        //如果定时器存在就清除掉
        if (t) {
          clearTimeout(t);
        }
        //不然就创建新的定时器
        t = setTimeout(function () {
          fn();
          t = null;
        }, 500);
      };
    };
    const initData = debounce(() => {
      if (isTeacher) {
        pjtTeaList(Number(route.params.id)).then((res) => {
          List.value = res.data.data;
        });
      } else {
        pjtStuList(Number(route.params.id)).then((res) => {
          List.value = res.data.data;
        });
      }
    });
    //修改内容卡片
    const onInfo = (pjtId: number) => {
      if (isTeacher) {
        dialog.value.onOpen(pjtId);
      }
    };
    const changeStatus = (item: IPjt) => {
      item.status === 1 ? (item.status = 0) : (item.status = 1);
      upPjtStatus(item.pjtId, item.status);
    };
    const podList = ref();
    const onPjtList = (item: IPjt) => {
      if (isTeacher) {
        podList.value.onOpen(item.pjtId);
      } else {
        const loadObj = ElLoading.service({
          lock: true,
          text: "首次创建实例需要等待3-4分钟",
          background: "rgba(0, 0, 0, 0.3)",
        });
        getCreatePod(item.pjtId).then((res) => {
          if (res.data.data.key) {
            const podId = res.data.data.value.podId;
            item.podId = podId;
            store.stuPodInfo = item;
            const url = router.resolve({
              path: `/text-page/pjdId=${item.pjtId}&podId=${podId}`,
            });
            window.open(url.href, "_parent");
          } else {
            ElMessage.error(res.data.data.value);
          }
          loadObj.close();
        });
      }
    };
    return {
      isTeacher,
      openDialog,
      changeStatus,
      dialog,
      podList,
      List,
      initData,
      onInfo,
      onPjtList,
    };
  },
});
</script>

<style lang="less">
.class-test {
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
      justify-content: start;
      border-bottom: 1px solid #c5c6c6;
      cursor: pointer;
      &.active {
        .item-type {
          color: #337ecc;
        }
      }
      .item-img {
        img {
          width: 100%;
          height: 100%;
        }
        height: 60px;
        width: 60px;
        color: #fff;
        border-radius: 5px;
        text-align: center;
        line-height: 60px;
        font-size: 20px;
      }
      .item-content {
        width: 90%;
        margin-left: 20px;
        div {
          line-height: 21px;
          font-size: 12px;
          span {
            padding-right: 10px;
          }
        }
        div:nth-child(1) {
          font-size: 18px;
        }
      }
      .item-btn {
        display: flex;
        width: 10%;
        transform: translate(-30px, 15px);
        button {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
