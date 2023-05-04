<template>
  <div class="video-class">
    <el-container>
      <el-header>{{ currentChapt.chapterName }}</el-header>
      <el-container>
        <el-aside width="230px">
          <div class="title" v-for="item in List" :key="item.id">
            <div class="chapter">
              <h1>{{ item.title.chapterName }}</h1>
              <div
                @click="routePush(item1.id)"
                class="item"
                v-for="item1 in item.cloudCourseChapters"
              >
                <el-icon style="transform: translate(0, 25%)" size="20px"
                  ><VideoPlay
                /></el-icon>
                {{ item1.chapterName }}
              </div>
            </div>
          </div>
        </el-aside>
        <el-main>
          <el-card style="height: 92vh"
            ><videoPlay v-bind="options"></videoPlay
          ></el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCourseList } from "@/request/api";
import type { IClassList, IClassItem } from "@/view/classCourse.vue";
import { VideoPlay } from "@element-plus/icons-vue";
import videoPlay from "vue3-video-play";
import "vue3-video-play/dist/style.css";
export default defineComponent({
  components: {
    VideoPlay,
    videoPlay,
  },
  setup() {
    //路由
    const route = useRoute();
    const router = useRouter();
    //获取数据
    const List: Ref<Array<IClassList>> = ref([]);
    const baseApi: string = import.meta.env.VITE_BASE_API;
    getCourseList(Number(route.params.id)).then((res) => {
      const array: Array<IClassList> = res.data.data;
      array.forEach((v) => {
        v.id = v.cloudCourseChapters[0].id as number;
        v.title = v.cloudCourseChapters.shift() as IClassItem;
        v.cloudCourseChapters.forEach((v) => {
          if (v.id === Number(route.params.courseId)) {
            v.videoPath = baseApi + v.videoPath;
            currentChapt.value = v;
          }
        });
      });
      List.value = array;
      options.src = currentChapt.value.videoPath;
      options.title = currentChapt.value.chapterName;
    });
    //视频
    let currentChapt: Ref<IClassItem> = ref({
      chapterName: "",
      courseId: 0,
      id: 0,
      levelChapter: null,
      videoPath: "",
    });
    // 播放器设置
    const options = reactive({
      width: "100%", //播放器高度
      height: "88vh", //播放器高度
      title: "", //视频名称
      webFullScreen: false, //网页全屏//是否支持快进快退
      currentTime: 0, //跳转到固定播放时间(s)
      control: true, //是否显示控制器
      ligthOff: false, //关灯模式
      volume: 0.3, //默认音量0-1
      src: "",
    });
    //跳转
    const routePush = (id: number) => {
      const url = router.resolve({ path: `/video/${route.params.id}/${id}` });
      window.open(url.href, "_parent");
    };
    return {
      List,
      currentChapt,
      options,
      routePush,
    };
  },
});
</script>
<style lang="less">
.video-class {
  header {
    height: 45px;
    background-color: #313131;
    text-align: center;
    line-height: 45px;
    font-weight: 700;
    font-size: 20px;
    color: #fff;
  }
  .el-aside {
    background-color: #313131 !important;
    height: 94vh !important;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
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
  }
  .title {
    line-height: 50px;
    .chapter {
      border: 1px solid #484848;
      margin: 10px;
      h1 {
        background-color: #313131;
        color: #fff;
        font-size: 20px;
        padding-left: 15px;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
          rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
      }
      .item {
        height: 50px;
        line-height: 50px;
        padding-left: 25px;
        color: #fff;
        white-space: nowrap; //禁止换行
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        background-color: rgb(72, 72, 72);
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px,
          rgba(0, 0, 0, 0.24) 0px 1px 2px;
      }
    }
  }
}
</style>
