<template>
  <el-container class="class-menu">
    <el-aside width="230px" class="menu">
      <el-menu text-color="#888888" router>
        <div class="img-box">
          <div class="img"></div>
        </div>
        <el-menu-item index="/class-course">
          <el-icon><Reading /></el-icon><span>课程</span>
        </el-menu-item>
        <el-menu-item index="/class-homework">
          <el-icon><Document /></el-icon><span>作业</span>
        </el-menu-item>
        <el-menu-item index="/class-data">
          <el-icon><FolderRemove /></el-icon><span>资料</span>
        </el-menu-item>
        <el-menu-item index="/class-test">
          <el-icon><DataBoard /></el-icon><span>实训</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
    
    <script lang="ts">
import { defineComponent } from "vue";
import {
  Document,
  Reading,
  FolderRemove,
  DataBoard,
} from "@element-plus/icons-vue";
export default defineComponent({
  name: "classMenu",
  components: {
    Document,
    Reading,
    FolderRemove,
    DataBoard,
  },
  setup() {},
});
</script>
    
<style lang="less">
.class-menu {
  .menu {
    transform: translate(0px, -15px);
    .el-menu {
      height: 92vh !important;
    }
    .img-box {
      height: 180px;
      .img {
        height: 120px;
        background-color: #888;
        width: 200px;
        margin: 0 auto;
        transform: translate(0px, 20px);
      }
    }
  }
}
</style>