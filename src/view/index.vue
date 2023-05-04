<template>
  <div class="index">
    <div class="titles">
      <span v-if="!isTeacher">•我的课程•</span>
      <span v-else>•所教课程•</span>
    </div>
    <div class="w">
      <div class="title">
        <el-button
          style="float: right; transform: translate(-30px, 8px)"
          type="primary"
          @click="isAddClass = true"
          >{{ isTeacher ? "添加课程" : "+ 选课" }}</el-button
        >
      </div>
      <el-empty description="暂无课程" v-if="classList.length === 0"></el-empty>
      <div class="item-box" v-for="item in classList" :key="item.id" v-else>
        <div
          class="item"
          @click.stop="toClass(`/class-course/${item.id}`, item)"
        >
          <div class="img-box">
            <!-- todo图片适配 -->
            <img class="img" :src="item.coverPath" />
          </div>
          <div class="content-box">
            <div class="class-content">
              <div class="class-name">{{ item.courseName }}</div>
              <div class="class-detail">
                <span>{{ item.teacherName }}</span
                >·<span>{{ item.schoolName }}</span>
                <div>课程邀请码：{{ item.courseCode }}</div>
                <div v-if="isTeacher">课程人数：{{ item.studentNumber }}</div>
              </div>
            </div>
          </div>
          <div class="menu-box">
            <div class="icon-box">
              <div
                class="icon-item"
                @click.stop="toClass(`/class-course/${item.id}`, item)"
              >
                <el-icon size="28px"><Reading /></el-icon>
                <div>章节</div>
              </div>
              <div
                class="icon-item"
                @click.stop="toClass(`/class-homework/${item.id}`, item)"
              >
                <el-icon size="28px"><Document /></el-icon>
                <div>作业</div>
              </div>
              <div
                class="icon-item"
                @click.stop="toClass(`/class-data/${item.id}`, item)"
              >
                <el-icon size="28px"><FolderRemove /></el-icon>
                <div>资料</div>
              </div>
              <div
                class="icon-item"
                @click.stop="toClass(`/class-test/${item.id}`, item)"
              >
                <el-icon size="28px"><DataBoard /></el-icon>
                <div>实训</div>
              </div>
            </div>
          </div>
          <el-button
            v-if="isTeacher"
            @click.stop="onDelete(item.id)"
            type="info"
            style="position: absolute; right: 150px"
            >取消授课</el-button
          >
        </div>
      </div>
    </div>
  </div>
  <!-- 添加对话框 -->
  <el-dialog v-model="isAddClass" title="添加课程">
    <el-form>
      <template v-if="isTeacher">
        <el-form-item label="课程名称">
          <el-input v-model="TeaClassForm.courseName" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="课程邀请码">
          <el-input v-model="StuClassForm.courseCode" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isAddClass = false">取消</el-button>
        <el-button type="primary" @click="addClass">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useMain } from "@/store/home";
import { ref, Ref, reactive } from "vue";
import {
  Document,
  Reading,
  FolderRemove,
  DataBoard,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  getStuList,
  getTeaList,
  postStuAdd,
  postTeaAdd,
  postCourseDelete,
} from "@/request/api";
import { ElMessage, ElMessageBox } from "element-plus";
import useClipboard from "vue-clipboard3";
export interface classInfo {
  id: number;
  courseName: string;
  teacherName: string;
  schoolName: string;
  coverPath: string;
  studentNumber: number;
  courseCode: null | number;
}
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
    const { isTeacher, userInfo } = store;
    //路由跳转
    const router = useRouter();
    const toClass = (url: string, item: classInfo) => {
      router.push(url);
      store.classInfo = item;
    };
    //复制
    const { toClipboard } = useClipboard();
    const copyInfo = async (info: string) => {
      try {
        await toClipboard(info);
        ElMessage.success("复制成功");
      } catch (e) {
        ElMessage.warning("您的浏览器不支持复制");
      }
    };
    //获取数据
    //课程列表
    let baseApi: string = import.meta.env.VITE_BASE_API;
    const classList: Ref<classInfo[]> = ref([]);
    const getList = async (courseId: number) => {
      const list: classInfo[] =
        isTeacher === true
          ? (await getTeaList(courseId)).data.data
          : (await getStuList(courseId)).data.data;
      list.forEach((v) => {
        v.coverPath = `${baseApi}${v.coverPath}`;
      });
      classList.value = list;
    };
    getList(Number(userInfo.id));
    //添加课程事件
    //对话框
    let isAddClass: Ref<boolean> = ref(false);
    const addClass = async () => {
      if (TeaClassForm.courseName || StuClassForm.courseCode) {
        if (isTeacher) {
          postTeaAdd(TeaClassForm).then((res) => {
            console.log(res.data);

            if (res.data.code === 500) {
              ElMessage.warning(res.data.msg);
            } else {
              ElMessageBox.alert(
                `课程邀请码为：${res.data.data.courseCode}`,
                "课程邀请码",
                {
                  confirmButtonText: "复制",
                  callback: () => {
                    copyInfo(res.data.data.courseCode);
                    isAddClass.value = false;
                    getList(Number(userInfo.id));
                  },
                }
              );
            }
          });
        } else {
          postStuAdd(StuClassForm).then((res) => {
            ElMessage.success(res.data.msg);
            isAddClass.value = false;
            getList(Number(userInfo.id));
          });
        }
      } else {
        ElMessage.warning("请输入内容");
      }
    };
    //添加课程表单
    const TeaClassForm = reactive({
      courseName: "",
    });
    const StuClassForm = reactive({
      courseCode: "",
    });
    //取消授课
    const onDelete = (id: number) => {
      ElMessageBox.confirm(
        "取消授课将会删除课程所有数据，确认取消授课？",
        "取消授课",
        {
          confirmButtonText: "删除",
          cancelButtonText: "不了",
        }
      ).then((res) => {
        postCourseDelete(id).then((res) => {
          ElMessage.success("删除成功");
          getList(Number(userInfo.id));
        });
      });
    };
    return {
      // pinia
      isTeacher,
      //路由跳转
      toClass,
      //课程列表
      classList,
      //对话框
      isAddClass,
      addClass,
      //表单
      TeaClassForm,
      StuClassForm,
      onDelete,
    };
  },
});
</script>

<style lang="less">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.index {
  width: 100%;
  position: relative;
  .titles {
    letter-spacing: 6px;
    padding-left: 6px;
    font-weight: 700;
    height: 30px;
    font-size: 18px;
    line-height: 30px;
    position: absolute;
    top: -15px;
    left: 250px;
    z-index: 9;
    color: #fefefe;
    clip-path: polygon(0 50%, 15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%);
    background-color: #6afaf5;
  }
  .w {
    margin: 25px 200px;
    width: 100%-400px;
    background-color: #fefefe;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    padding-bottom: 30px;
    height: 88vh;
    overflow: auto;
    position: relative;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(59, 59, 59, 0.2);
      background: #cacaca;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(133, 133, 133, 0.2);
      border-radius: 10px;
      background: #ededed;
    }

    .title {
      position: relative;
      width: 100%;
      padding-left: 30px;
      height: 40px;
    }
    .item-box {
      padding: 20px 30px;
      margin: 10px 100px;
      border-radius: 10px;
      transition: all 0.1s;
      &:hover {
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      }
      .item {
        height: 150px;
        display: flex;
        border-bottom: 2px solid #ebedef;
        .img-box {
          width: 200px;
          height: 130px;

          .img {
            cursor: pointer;
            height: 100%;
            width: 100%;
            margin-top: 5px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
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
              margin-top: 15px;
              div {
                margin: 5px 0;
              }
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
              text-align: center;
              flex: 1;
              transition: all 0.2s;
              &:hover {
                background-color: #888;
              }
            }
          }
        }
      }
    }
  }
}
</style>
