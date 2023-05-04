<template>
  <el-drawer v-model="isOpen" title="实例列表" direction="rtl" size="50%">
    <el-descriptions
      class="margin-top"
      :title="item.nickName"
      :column="2"
      border
      v-for="item in list"
      :key="item.podId"
    >
      <template #extra>
        <el-button type="info" v-if="item.status === 2" disabled>
          已结束
        </el-button>
        <el-button
          v-else
          :type="item.status === 0 ? 'warning' : 'success'"
          @click="changeStatus(item)"
        >
          {{ item.status === 0 ? "禁用" : "启用" }}
        </el-button>

        <el-button @click="changePod(item)" :disabled="item.status === 2"
          >修改</el-button
        >
      </template>
      <el-descriptions-item label="镜像名称">
        <pageTwo
          :item="item"
          :image="item.image"
          @valueChange="valueChange"
        ></pageTwo>
      </el-descriptions-item>
      <el-descriptions-item label="结束时间">
        <el-date-picker
          :disabled-date="disabledDateFun"
          type="datetime"
          placeholder="实训结束时间"
          v-model="item.endTime"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-descriptions-item>
      <el-descriptions-item label="CPU上限（m）">
        <el-input-number
          :max="200"
          :step="1"
          :min="item.requestsCpu"
          v-model="item.limitsCpu"
        ></el-input-number>
      </el-descriptions-item>
      <el-descriptions-item label="内存上限（Mi）">
        <el-input-number
          v-model="item.limitsMemory"
          :max="1000"
          :min="item.requestsMemory"
          :step="10"
        ></el-input-number>
      </el-descriptions-item>
      <el-descriptions-item label="CPU下限（m）">
        <el-input-number
          :max="item.limitsCpu"
          :step="1"
          :min="1"
          v-model="item.requestsCpu"
        ></el-input-number>
      </el-descriptions-item>

      <el-descriptions-item label="内存下限（Mi）">
        <el-input-number
          :max="item.limitsMemory"
          :min="10"
          :step="10"
          v-model="item.requestsMemory"
        ></el-input-number>
      </el-descriptions-item>

      <el-descriptions-item label="环境变量">
        <div class="env-content">
          <div class="title">
            <span></span>
            <div>
              <el-button type="primary" size="small" @click="onAdd(item)"
                >增加</el-button
              >
              <el-button size="small" @click="onDelete(item)">删除</el-button>
            </div>
          </div>
          <table>
            <tr v-for="(value, key, index) in item.cEnv" :key="key">
              <td>
                <el-input
                  type="text"
                  v-model="item.keyArr[index]"
                  @blur="keyChange(item, key, value, index)"
                />
              </td>
              <td><el-input type="text" v-model="item.cEnv[key]" /></td>
            </tr>
          </table>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "@vue/runtime-core";
import {
  podList,
  PostChangePod,
  isResourcesEnough,
  upPodStatus,
} from "@/request/api";
import type { IEnvList } from "@/components/pageThree.vue";
import pageTwo from "@/components/pageTwo.vue";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";

interface IPod {
  podId: number;
  pjtId?: number;
  studentId?: number;
  nickName: string;
  image: string;
  environment: IEnvList | string;
  limitsCpu: number;
  requestsCpu: number;
  limitsMemory: number;
  requestsMemory: number;
  startTime: string;
  endTime: string;
  status: 0 | 1 | 2;

  tagName?: string;
  imageName?: string;
  //便捷属性
  cEnv: IEnvList;
  keyArr: Array<string>;
}
export default defineComponent({
  components: {
    pageTwo,
  },
  setup() {
    const disabledDateFun = (time: Record<string, any>) => {
      if (time.getTime() < new Date().getTime()) {
        return time.getTime() < Date.now();
      }
    };
    const isOpen = ref(false);
    const list: Ref<Array<IPod>> = ref([]);
    const onOpen = (pjtId: number) => {
      podList(pjtId).then((res) => {
        const arr: Array<IPod> = res.data.data;
        console.log(arr);

        arr.forEach((v) => {
          if (v.environment != "") {
            v.cEnv = JSON.parse(v.environment as string);
          } else {
            v.cEnv = {};
          }
          v.keyArr = [];
          for (let key in v.cEnv) {
            v.keyArr.push(key);
          }
        });
        list.value = arr;
        console.log(list.value);
      });
      isOpen.value = true;
    };
    const keyChange = (
      item: IPod,
      key: string | number,
      value: string,
      index: number
    ) => {
      let flag = true;
      for (let i = item.keyArr.length - 1; i >= 0; i--) {
        if (
          item.keyArr.indexOf(item.keyArr[i]) !=
          item.keyArr.lastIndexOf(item.keyArr[i])
        ) {
          ElMessage.warning("不能填写相同的环境变量");
          flag = false;
          Reflect.deleteProperty(item.cEnv, key);
          item.keyArr.pop();
        }
      }
      if (flag) {
        Reflect.deleteProperty(item.cEnv, key);
        item.cEnv[item.keyArr[index]] = value;
      }
    };
    const onAdd = (item: IPod) => {
      let flag = true;
      for (let key in item.cEnv) {
        if (item.cEnv[key] === "") {
          flag = false;
          ElMessage.warning("请填写变量");
        } else {
          flag = true;
        }
      }
      if (flag) {
        item.cEnv[""] = "";
        item.keyArr.push("");
      }
    };
    const onDelete = (item: IPod) => {
      Reflect.deleteProperty(item.cEnv, item.keyArr[item.keyArr.length - 1]);
      item.keyArr.pop();
    };
    //修改状态
    const changeStatus = (item: IPod) => {
      item.status === 0 ? (item.status = 1) : (item.status = 0);
      upPodStatus(item.podId, item.status);
    };
    //修改实例
    const changePod = (item: IPod) => {
      //修改imageName和tagName
      const arr = item.image.split(":");
      item.imageName = arr[0];
      item.tagName = arr[1];
      //拿出数据
      const {
        endTime,
        environment,
        imageName,
        limitsCpu,
        limitsMemory,
        pjtId,
        podId,
        requestsCpu,
        requestsMemory,
        startTime,
        status,
        tagName,
      } = item;
      isResourcesEnough(1, limitsCpu, limitsMemory).then((res) => {
        if (res.data.data.key) {
          ElMessage.success(res.data.data.value);
          ElMessageBox.confirm(
            "修改实例会删除旧实例，请提醒学生保存文件",
            "警告",
            {
              confirmButtonText: "了解",
              showCancelButton: false,
              type: "warning",
            }
          ).then(() => {
            const loader = ElLoading.service({
              lock: true,
              text: "正在修改实例，请等待3~4分钟",
              background: "rgba(0, 0, 0, 0.3)",
            });
            PostChangePod({
              endTime,
              environment: item.cEnv,
              imageName,
              limitsCpu,
              limitsMemory,
              pjtId,
              podId,
              requestsCpu,
              requestsMemory,
              startTime,
              status,
              tagName,
            }).then((res) => {
              if (res.data.isSuccess) {
                ElMessage.success(res.data.info);
              } else {
                ElMessageBox.confirm(res.data.errinfo, res.data.info, {
                  confirmButtonText: "了解",
                  showCancelButton: false,
                  type: "error",
                });
              }
              loader.close();
            });
          });
        }
      });
    };
    const valueChange = (item: IPod, imageName: string, tagName: string) => {
      item.imageName = imageName;
      item.tagName = tagName;
    };
    return {
      disabledDateFun,
      isOpen,
      onOpen,
      keyChange,
      onAdd,
      onDelete,
      list,
      changeStatus,
      changePod,
      valueChange,
    };
  },
});
</script>

<style></style>
