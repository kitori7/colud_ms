<template>
  <el-container class="class-menu">
    <el-aside width="230px" class="menu">
      <el-menu text-color="#888888" router active-text-color="#04f2ff">
        <div class="img-box">
          <div class="img" v-if="isTeacher">
            <upLoad
              accept=".jpg,.jpeg,.png"
              action="/cloudms/teacher_user/course/updateCover"
              :onOnSucceed="succeed"
              :data="{ courseId: id }"
            >
              <img :src="classInfo.coverPath" alt="" /><span class="mask"
                >修改封面</span
              >
            </upLoad>
          </div>
          <div class="img" v-else>
            <img :src="classInfo.coverPath" alt="" />
          </div>
        </div>

        <el-menu-item :index="'/class-course/' + id">
          <el-icon><Reading /></el-icon><span>章节</span>
        </el-menu-item>
        <el-menu-item :index="'/class-homework/' + id">
          <el-icon><Document /></el-icon><span>作业</span>
        </el-menu-item>
        <el-menu-item :index="'/class-data/' + id">
          <el-icon><FolderRemove /></el-icon><span>资料</span>
        </el-menu-item>
        <el-menu-item :index="'/class-test/' + id">
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
import { useRoute } from "vue-router";
import { useMain } from "@/store/home";
import upLoad from "@/components/upLoad.vue";
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
    upLoad,
  },
  setup() {
    const route = useRoute();
    const { id } = route.params;
    const store = useMain();
    const { classInfo, isTeacher } = store;
    const baseApi = import.meta.env.VITE_BASE_API;
    const succeed = (res: any) => {
      let cover = res.data;
      cover = baseApi + res.data;
      classInfo.coverPath = cover;
    };
    return { id, classInfo, succeed, isTeacher };
  },
});
</script>

<style lang="less">
.class-menu {
  .menu {
    transform: translate(0px, -15px);
    .el-menu {
      height: 92vh !important;
      .el-menu-item:hover {
        background-color: #e5e5e5;
      }
    }
    .img-box {
      height: 180px;
      border-top: 1px solid #999;
      .img {
        position: relative;
        height: 130px;
        width: 200px;
        margin: 20px 13px;

        .el-upload {
          height: 130px !important;
          width: 200px;
        }
        &:hover {
          .mask {
            display: block;
          }
        }
        img {
          width: 200px;
          height: 130px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        }
        .mask {
          display: none;
          position: absolute;
          width: 200px;
          border-radius: 8px;
          background-color: rgba(0, 0, 0, 0.3);
          height: 100%;
          color: #fff;
          pointer-events: none;
          line-height: 120px;
          top: 0px;
          left: 50%;
          text-align: center;
          transform: translate(-50%);
          z-index: 2;
        }
      }
    }
  }
}
</style>
