<template>
  <div class="class-test">
    <div class="done-box">
      <el-button
        style="float: right; transform: translate(-30px, 5px)"
        type="primary"
        v-if="isTeacher"
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
      <div class="item active" @click="toUseTest">
        <div class="item-img">作业</div>
        <div class="item-content">
          <div>实训名称</div>
          <div>作答时间：2022-12-18 17:00 至 2022-12-28 18:00</div>
          <div class="item-type" v-if="!isTeacher">未完成</div>
        </div>
      </div>
    </div>
  </div>
</template>
      
<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, ref, Ref } from "vue";
import { useMain } from "@/store/home";
export default defineComponent({
  name: "classTest",
  setup() {
    //pinia
    const store = useMain();
    const { isTeacher } = store;
    //路由
    const router = useRouter();
    const toUseTest = () => {
      const url = router.resolve({
        path: "use-test",
      });
      window.open(url.href, "_blank");
    };
    return {
      toUseTest,
      isTeacher,
    };
  },
});
</script>
      
<style lang="less">
.class-test {
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
          background-color: #337ecc;
        }
        .item-type {
          color: #337ecc;
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