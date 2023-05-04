<template>
  <div class="class-course">
    <div class="done-box">
      <el-button
        style="float: right; transform: translate(-30px, 5px)"
        type="primary"
        v-if="isTeacher"
        @click="isAdd = true"
        >添加章节目录</el-button
      >
    </div>
    <el-empty v-if="List.length === 0" description="暂无章节目录"></el-empty>
    <div class="item-box" v-else>
      <div class="title">目录</div>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          class="chapter"
          v-for="item in List"
          :key="item"
          :name="item.id"
        >
          <template #title>
            <div class="item-title">
              {{ item.title.chapterName }}
              <el-button
                type="info"
                size="small"
                style="
                  position: absolute;
                  right: 1.5vw;
                  transform: translate(0, 50%);
                "
                v-if="isTeacher"
                @click.stop="onDelete(item.id)"
                >删除</el-button
              >
            </div>
          </template>
          <div
            class="item"
            v-for="item1 in item.cloudCourseChapters"
            :key="item1.id"
            @click="itemClick(item1.id)"
          >
            <el-icon style="transform: translate(0, 25%)" size="20px"
              ><VideoPlay
            /></el-icon>
            <span>{{ item1.chapterName }}</span>
            <el-button
              type="info"
              size="small"
              style="float: right; transform: translate(-30px, 8px)"
              @click.stop="onDelete(item1.id)"
              v-if="isTeacher"
              >删除</el-button
            >
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 对话框 -->
    <el-dialog v-model="isAdd" title="添加课程">
      <el-form :model="classFrom">
        <el-form-item label="课程类型" required>
          <el-select placeholder="请选择章节或课时" v-model="isClassHour">
            <el-option label="章节" :value="false" />
            <el-option label="课时" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="章节名称" required v-show="isClassHour === true">
          <el-select v-model="classFrom.levelChapter" placeholder="请选择章节">
            <el-option
              v-for="item in List"
              :key="item.title"
              :value="item.title.id"
              :label="item.title.chapterName"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="isClassHour ? '课时名称' : '章节名称'" required>
          <el-input v-model="classFrom.chapterName" />
        </el-form-item>
        <el-form-item
          label="上传视频文件"
          required
          v-show="isClassHour === true"
        >
          <up-load
            accept=".mp4"
            action="/cloudms/chapter/uploadVideo"
            :onOnSucceed="succeed"
          >
            <el-button type="primary">上传视频</el-button>
          </up-load>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isAdd = false">取消</el-button>
          <el-button type="primary" @click="confirm"> 添加 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export interface IClassItem {
  chapterContent?: any;
  chapterName: string;
  courseId: number;
  id: number;
  levelChapter: null | number;
  videoPath: string;
}
export interface IClassList {
  cloudCourseChapters: Array<IClassItem>;
  title: IClassItem;
  id: number;
}
import { defineComponent, onMounted, reactive, ref, Ref } from "vue";
import { useMain } from "@/store/home";
import { useRoute, useRouter } from "vue-router";
import {
  getCourseList,
  postChapterAdd,
  postChapterDelete,
} from "@/request/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { VideoPlay } from "@element-plus/icons-vue";
import upLoad from "@/components/upLoad.vue";
export default defineComponent({
  name: "classCourse",
  components: {
    upLoad,
    VideoPlay,
  },
  setup() {
    //路由
    const route = useRoute();
    const router = useRouter();
    let { id } = route.params;
    // pinia
    const store = useMain();
    const { isTeacher } = store;
    const List: Ref<Array<IClassList>> = ref([]);
    const getList = (id: number) => {
      getCourseList(id).then((res) => {
        const array: Array<IClassList> = res.data.data;
        array.forEach((v) => {
          v.id = v.cloudCourseChapters[0].id as number;
          v.title = v.cloudCourseChapters.shift() as IClassItem;
          activeNames.value.push(v.id);
        });
        List.value = array;
        console.log(List.value);
      });
    };
    onMounted(() => {
      getList(Number(id));
    });

    //选项内容
    let isClassHour: Ref<boolean> = ref(false);

    //添加课程
    const isAdd: Ref<boolean> = ref(false);
    let classFrom: Ref<IClassItem> = ref({
      chapterName: "",
      courseId: Number(id),
      levelChapter: null,
      id: 0,
      videoPath: "",
    });
    //el折叠框的展开数组
    const activeNames: Ref<Array<number>> = ref([]);
    const confirm = () => {
      if (isClassHour.value) {
        if (
          classFrom.value.chapterName &&
          classFrom.value.levelChapter &&
          classFrom.value.videoPath
        ) {
          //发请求
          if (classFrom.value.levelChapter) {
            activeNames.value.push(classFrom.value.levelChapter);
          }
          postChapterAdd(classFrom.value);
          getList(Number(id));
          ElMessage.success("添加成功");
          isClassHour.value = false;
          isAdd.value = false;
          classFrom.value = {
            chapterName: "",
            courseId: Number(id),
            levelChapter: null,
            id: 0,
            videoPath: "",
          };
        } else {
          ElMessage.warning("请填写完整内容");
        }
      } else {
        classFrom.value.levelChapter = null;
        postChapterAdd(classFrom.value);
        getList(Number(id));
        ElMessage.success("添加成功");
        isClassHour.value = false;
        isAdd.value = false;
        classFrom.value = {
          chapterName: "",
          courseId: Number(id),
          levelChapter: null,
          id: 0,
          videoPath: "",
        };
      }
    };
    //删除课程
    const onDelete = (id: number) => {
      ElMessageBox.confirm("确认删除？", "删除章节", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
      }).then((res) => {
        postChapterDelete(id).then((res) => {
          ElMessage.success("删除成功");
          List.value.forEach((v, i) => {
            if (v.title.id === id) {
              List.value.splice(i, 1);
            }
            v.cloudCourseChapters.forEach((x, i) => {
              if (x.id === id) {
                v.cloudCourseChapters.splice(i, 1);
              }
            });
          });
        });
      });
    };
    //上传视频
    const succeed = (res: any) => {
      if (res.code !== 200) {
        ElMessage.warning("上传失败，请重新尝试");
      } else {
        ElMessage.success("上传成功");
        classFrom.value.videoPath = res.data.videoPath;
      }
    };
    //item点击
    const itemClick = (chapterId: number) => {
      const url = router.resolve({ path: `/video/${id}/${chapterId}` });
      window.open(url.href, "_blank");
    };
    return {
      isTeacher,
      List,
      isClassHour,
      isAdd,
      classFrom,
      activeNames,
      confirm,
      onDelete,
      succeed,
      itemClick,
    };
  },
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
    background-color: #6afaf5;
    & ~ span {
      color: #69faf5;
    }
  }
}
.class-course {
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
    }
    .el-collapse-item__header {
      position: relative;
      background-color: #e5e5e5 !important;
      .el-collapse-item__arrow {
        color: #469895 !important;
      }
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
      cursor: pointer;
      padding-left: 30px;
      height: 40px;
      line-height: 40px;
      transition: all 0.2s;
      & > span {
        margin-left: 10px;
      }

      &:hover {
        color: #469895;
      }
    }
  }
}
</style>
