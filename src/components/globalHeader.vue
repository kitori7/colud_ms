<template>
  <el-container>
    <el-header>
      <div class="global-header">
        <div class="w">
          <span class="school-name">韶关学院</span>
          <div class="user-box">
            <span class="active"></span>
            <span class="username">用户名</span>
            <el-icon color="#fff" class="icon" size="20px"
              ><ArrowDown
            /></el-icon>
          </div>
        </div>
      </div>
    </el-header>
  </el-container>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
export default defineComponent({
  name: "globalHeader",
  components: {
    ArrowDown,
  },
  setup() {
    return {};
  },
});
</script>
  
<style lang="less">
.el-header {
  padding: 0 !important;
}
.global-header {
  width: 100%;
  height: 45px;
  background-color: #337ecc;
  .w {
    padding: 0 250px;
    position: relative;
    .school-name {
      line-height: 45px;
      font-size: 18px;
      color: #fff;
    }
    .user-box {
      position: absolute;
      display: flex;
      justify-content: space-between;
      right: 110px;
      top: 15px;
      width: 140px;
      .active {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 100%;
        background-color: #555;
        border: 5px solid #337ecc;
      }
      .username {
        line-height: 35px;
        color: #fff;
      }
      .icon {
        transform: translate(0, 8px);
      }
    }
  }
}
</style>