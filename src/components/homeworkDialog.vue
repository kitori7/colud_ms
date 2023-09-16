<template>
  <el-dialog v-model="isOpen" title="添加作业" @closed="init">
    <el-form :model="homeworkForm" label-width="100px">
      <el-form-item label="作业名称" required>
        <el-input v-model="homeworkForm.homeworkName"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-config-provider :locale="zhCn">
          <el-date-picker
            :disabled-date="disabledDateFun"
            v-model="homeworkForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="homeworkForm.endTime = ''"
          />
        </el-config-provider>
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-config-provider :locale="zhCn">
          <el-date-picker
            :disabled-date="disabledEndFun"
            v-model="homeworkForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-config-provider>
      </el-form-item>
      <el-form-item label="作业状态">
        <el-switch v-model="isStatus" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="sub">提交</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import WangEditor from "./WangEditor.vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { postAddHomework, getHomework, putUpdateHomework } from "@/request/api";
export interface IHomeworkForm {
  courseId: number;
  endTime: string;
  homeworkName: string;
  startTime: string;
  completeStatus: null;
  createBy: number;
  id: number;
  status: string;
}
export default defineComponent({
  components: { WangEditor },
  emits: ["update"],
  setup(props, { emit }) {
    const route = useRoute();
    const isOpen = ref(false);
    const isChange = ref(false);
    const onOpen = (change: boolean, item?: any) => {
      if (change) {
        homeworkForm.value = item;
        isStatus.value = item.status === "1" ? true : false;
      }
      isOpen.value = true;
      isChange.value = change;
    };
    const sub = () => {
      isOpen.value = false;
      if (!isChange.value) {
        postAddHomework(homeworkForm.value).then((res) => {
          console.log(res.data);
          ElMessage.success("提交成功");
          emit("update");
        });
      } else {
        putUpdateHomework(homeworkForm.value).then((res) => {
          console.log(res.data);
          ElMessage.success("修改成功");
        });
      }
    };
    const isStatus = ref(true);
    watch(isStatus, (newValue, oldValue) => {
      if (newValue) {
        homeworkForm.value.status = "1";
      } else {
        homeworkForm.value.status = "2";
      }
    });
    const homeworkForm = ref({
      courseId: Number(route.params.id),
      startTime: "",
      endTime: "",
      homeworkName: "",
      status: "1",
    });
    const disabledDateFun = (time: Record<string, any>) => {
      if (time.getTime() < new Date().getTime()) {
        return time.getTime() < Date.now();
      }
    };
    const disabledEndFun = (time: Record<string, any>) => {
      if (time.getTime() < dayjs(homeworkForm.value.startTime)) {
        return time.getTime() < dayjs(homeworkForm.value.startTime);
      }
    };
    const init = () => {
      homeworkForm.value = {
        courseId: Number(route.params.id),
        startTime: "",
        endTime: "",
        homeworkName: "",
        status: "1",
      };
    };
    return {
      isOpen,
      onOpen,
      sub,
      zhCn,
      homeworkForm,
      disabledDateFun,
      disabledEndFun,
      init,
      isStatus,
    };
  },
});
</script>
<style lang="less"></style>
