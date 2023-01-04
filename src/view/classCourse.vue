<template>
  <div class="class-course">
    <div class="done-box">
      <span class="round active-round"></span>
      <span>已完成的任务点：0/10</span>
    </div>
    <div class="item-box">
      <div class="title">目录</div>
      <el-collapse>
        <el-collapse-item class="chapter">
          <template #title>
            <div class="item-title">章节名称</div>
          </template>
          <div class="item">
            <span class="round active-round"></span>
            <span>已完成</span>
          </div>
          <div class="item">
            <span class="round"></span>
            <span>已完成</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
      
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
export default defineComponent({
  name: "classCourse",
  setup() {},
});
</script>
      
<style lang="less">
.round {
  display: inline-block;
  background-color: #888;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  transform: translate(0, 5px);
  margin-right: 20px;
  &.active-round {
    background-color: #337ecc;
    & ~ span {
      color: #337ecc;
    }
  }
}

.class-course {
  width: 100%;
  height: 86.6vh;
  background-color: #fff;
  padding: 0 20px;
  overflow: auto;
  .done-box {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #c5c6c6;
    span {
      color: #888;
      letter-spacing: 2px;
    }
  }
  .item-box {
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      color: #888;
      font-size: 12px;
    }
    .el-collapse-item__header {
      background-color: #ecf5ff !important;
    }
    .item-title {
      padding-left: 20px;
      font-weight: 700;
      font-size: 17px;
      letter-spacing: 2px;
      user-select: none;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .item {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>