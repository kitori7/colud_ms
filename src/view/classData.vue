<template>
  <div class="class-data">
    <div class="search-box">
      <upLoad
        action="/cloudms/courseFile/uploadFile"
        accept="*"
        :data="{ courseId: id }"
        @on-succeed="uploadSuccess"
      >
        <el-button
          style="float: left; transform: translate(15px, 5px)"
          type="primary"
          v-if="isTeacher"
          >添加资料</el-button
        >
      </upLoad>
      <el-input
        v-model="FileFrom.keyword"
        size="large"
        class="el-input"
        placeholder="搜索"
        :suffix-icon="Search"
        @change="getList(FileFrom)"
      />
    </div>
    <div class="content-box">
      <div class="title">
        <span>文件名</span>
        <span>类型</span>
        <span>创建时间</span>
      </div>
      <el-empty description="暂无资料" v-if="List.length === 0"></el-empty>
      <div
        v-else
        class="item"
        v-for="item in List"
        :key="item.id"
        @click="onDownLoad(item.filePath)"
      >
        <span
          ><div><img :src="item.src" alt="" />{{ item.fileName }}</div>
        </span>
        <!-- <span>
          <img src="../assets/img/.pdf.png" alt="" />{{ item.fileName }}</span
        > -->
        <span>{{ item.fileSuffix }}</span>
        <span>{{ item.createTime }}</span>
        <el-button
          style="position: absolute; right: 60px; transform: translate(0, 50%)"
          type="info"
          size="small"
          v-if="isTeacher"
          @click.stop="onDelete(item.id)"
          >删除</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useMain } from "@/store/home";
import { useRoute } from "vue-router";
import { getFile, postFileDelete } from "@/request/api";
import upLoad from "@/components/upLoad.vue";
import { ElMessage } from "element-plus";

interface IFile {
  id: number;
  fileName: string;
  fileSuffix: string;
  filePath: string;
  createTime: string;
  src?: string;
}
export default defineComponent({
  components: { upLoad },
  setup() {
    // pinia
    const store = useMain();
    const { isTeacher } = store;
    //route
    const route = useRoute();
    const { id } = route.params;
    //搜索框内容
    let searchData: Ref<string> = ref("");
    //对象转化为path
    const convertObj = (data: any) => {
      const _result = [];
      for (let key in data) {
        let value = data[key];
        _result.push(key + "=" + value);
      }
      return _result.join("&");
    };
    //动态获取图片资源
    //初始化
    let List: Ref<Array<IFile>> = ref([]);
    const FileFrom = reactive({
      courseId: Number(id),
      keyword: "",
    });
    const baseApi = import.meta.env.VITE_BASE_API;
    const getList = async (data: any) => {
      let nList: Array<IFile> = [];
      let req = {};
      if (data.keyword === "") {
        req = convertObj({ courseId: Number(id) });
      } else {
        req = convertObj(data);
      }
      getFile(req).then((res) => {
        nList = res.data.data;
        nList.forEach((v) => {
          v.filePath = baseApi + v.filePath;
          if (
            v.fileSuffix === ".docx" ||
            v.fileSuffix === ".txt" ||
            v.fileSuffix === ".mp4" ||
            v.fileSuffix === ".pdf" ||
            v.fileSuffix === ".ppt"
          ) {
            v.src = `../src/assets/img/${v.fileSuffix.slice(1)}.png`;
          }
        });

        List.value = nList;
      });
    };
    onMounted(() => {
      getList(FileFrom);
    });

    const uploadSuccess = (res: any) => {
      console.log(res);
      if (res.code === 500) {
        ElMessage.warning(res.msg);
      }
      getList(FileFrom);
    };
    //下载软件
    const onDownLoad = (filePath: string) => {
      // downLoad(filePath).then((res)=>{
      //   console.log(res.data);
      // })
      console.log(List.value);
      window.open(filePath);
    };
    //删除文件
    const onDelete = (fileId: number) => {
      console.log(fileId);
      postFileDelete(Number(id), fileId).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success(res.data.msg);
        } else {
          ElMessage.warning(res.data.msg);
        }
      });
    };
    return {
      //搜索框内容
      FileFrom,
      searchData,
      List,
      Search,
      isTeacher,
      id,
      uploadSuccess,
      onDownLoad,
      getList,
      onDelete,
    };
  },
});
</script>

<style lang="less">
.class-data {
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  width: 100%;
  height: 86.6vh;
  background-color: #fff;
  .search-box {
    height: 60px;
    width: 100%;
    padding: 10px;
    padding-right: 30px;
    display: flex;
    justify-content: space-between;
    .el-input {
      float: right;
      width: 20%;
    }
  }
  .content-box {
    margin: 0 20px;
    .title {
      background-color: #898989;
      display: flex;
      height: 25px;
      font-size: 20px;
      font-weight: 700;
      line-height: 25px;
      color: #fff;
      span {
        text-align: center;
        flex: 2;
        &:first-child {
          flex: 4;
        }
      }
    }
    .item {
      cursor: pointer;
      padding: 15px 0px;
      display: flex;
      margin-top: 15px;
      font-size: 18px;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
        rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
      img {
        display: inline-block;
        width: 40px;
        // height: 30px;
        vertical-align: middle;
        margin-right: 30px;
      }
      span {
        flex: 2;
        text-align: center;
        vertical-align: middle;
        line-height: 48.725px;
        div {
          padding-left: 12vw;
        }

        &:first-child {
          flex: 4;
          text-align: left;
        }
      }
    }
  }
}
</style>
