<template>
  <div class="index">
    <div class="w">
      <div class="title" v-if="!isTeacher">•我的课程•</div>
      <div class="title" v-else>
        •所教课程•
        <el-button
          style="float: right; transform: translate(-30px, 5px)"
          type="primary"
          v-if="isTeacher"
          >添加课程</el-button
        >
      </div>
      <div class="item-box">
        <div class="item" @click="toClass('/class-menu')">
          <div class="img-box">
            <!-- todo图片适配 -->
            <div class="img"></div>
          </div>
          <div class="content-box">
            <div class="class-content">
              <div class="class-name">数据结构</div>
              <div class="class-detail">
                <span>陈正铭</span>·<span>韶关学院</span>
              </div>
            </div>
          </div>
          <div class="menu-box">
            <div class="icon-box">
              <div class="icon-item" @click.stop="toClass('/class-course')">
                <el-icon size="28px"><Reading /></el-icon>
                <div>课程</div>
              </div>
              <div class="icon-item" @click.stop="toClass('/class-homework')">
                <el-icon size="28px"><Document /></el-icon>
                <div>作业</div>
              </div>
              <div class="icon-item" @click.stop="toClass('/class-data')">
                <el-icon size="28px"><FolderRemove /></el-icon>
                <div>资料</div>
              </div>
              <div class="icon-item" @click.stop="toClass('/class-test')">
                <el-icon size="28px"><DataBoard /></el-icon>
                <div>试验</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
import { defineComponent } from "vue";
import { useMain } from "@/store/home";
import {
  Document,
  Reading,
  FolderRemove,
  DataBoard,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "index",
  components: {
    Document,
    Reading,
    FolderRemove,
    DataBoard,
  },
  setup() {
    //pinia
    const store = useMain();
    const { isTeacher } = store;
    //路由跳转
    const router = useRouter();
    const toClass = (url: string) => {
      router.push(url);
    };
    return {
      // pinia
      isTeacher,
      //路由跳转
      toClass,
    };
  },
});
</script>
    
<style lang="less">
.index {
  width: 100%;
  .w {
    margin: 25px 200px;
    width: 100%-400px;
    background-color: #fefefe;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    .title {
      width: 100%;
      padding-left: 30px;
      font-size: 22px;
      letter-spacing: 5px;
      height: 50px;
      line-height: 50px;
      font-weight: 700;
    }
    .item-box {
      margin: 10px 100px;
      .item {
        height: 150px;
        display: flex;
        border-bottom: 2px solid #ebedef;
        .img-box {
          flex: 3;
          .img {
            cursor: pointer;
            height: 85%;
            background-color: #222;
          }
        }
        .content-box {
          flex: 7;
          .class-content {
            cursor: pointer;
            padding: 20px 30px;
            .class-name {
              font-size: 20px;
              letter-spacing: 3px;
            }
            .class-detail {
              font-size: 14px;
              letter-spacing: 1px;
              margin-top: 5px;
            }
          }
        }
        .menu-box {
          position: relative;
          flex: 3;
          display: flex;
          .icon-box {
            width: 100%;
            position: absolute;
            bottom: 20px;
            display: flex;
            .icon-item {
              cursor: pointer;
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>