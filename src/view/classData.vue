<template>
  <div class="class-data">
    <div class="search-box">
      <el-button
        style="float: left; transform: translate(15px, 5px)"
        type="primary"
        v-if="isTeacher"
        >添加资料</el-button
      >
      <el-input
        v-model="searchData"
        size="large"
        class="el-input"
        placeholder="搜索"
        :suffix-icon="Search"
      />
    </div>
    <div class="content-box">
      <div class="title">
        <span>文件名</span>
        <span>大小</span>
        <span>创建者</span>
        <span>创建时间</span>
      </div>
      <div class="item">
        <img src="@/assets/img/txt.png" alt="" /><span>文本</span>
      </div>
      <div class="item">
        <img src="@/assets/img/txt.png" alt="" /><span>文本</span>
      </div>
    </div>
  </div>
</template>
          
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useMain } from "@/store/home";
export default defineComponent({
  name: "classData",
  setup() {
    // pinia
    const store = useMain();
    const { isTeacher } = store;
    //搜索框内容
    let searchData: Ref<string> = ref("");
    return {
      //搜索框内容
      searchData,
      Search,
      isTeacher,
    };
  },
});
</script>
          
<style lang="less">
.class-data {
  width: 100%;
  height: 86.6vh;
  background-color: #fff;
  .search-box {
    height: 60px;
    width: 100%;
    padding: 10px;
    padding-right: 30px;
    .el-input {
      float: right;
      width: 20%;
    }
  }
  .content-box {
    margin: 0 20px;
    .title {
      background-color: #c5c6c6;
      display: flex;
      height: 25px;
      line-height: 25px;
      color: #fff;
      span {
        flex: 1;
        padding-left: 40px;
        &:first-child {
          flex: 4;
        }
      }
    }
    .item {
      padding: 8px 15px;
      img {
        display: inline-block;
        width: 40px;
        height: 45px;
        vertical-align: middle;
        margin-right: 30px;
      }
      span {
        vertical-align: middle;
      }
    }
  }
}
</style>