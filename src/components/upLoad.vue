<template>
  <el-upload
    :show-file-list="false"
    :headers="headers"
    :action="baseApi + action"
    :accept="accept"
    ref="UploadRef"
    :on-success="uploadSucceed"
    :on-error="uploadError"
    :before-upload="uploadBefore"
    :data="data"
    name="file"
  >
    <template #trigger>
      <slot></slot>
    </template>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { ElLoading, UploadInstance, UploadProps } from "element-plus";
import { ElMessage } from "element-plus";

export default defineComponent({
  props: {
    data: {
      type: Object,
    },
    accept: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  emits: ["onSucceed", "onError"],
  setup(props, { emit }) {
    //请求头

    const Authorization = localStorage.getItem("Authorization");
    const headers = {
      Authorization,
      // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };
    const baseApi = import.meta.env.VITE_BASE_API;
    const UploadRef = ref<UploadInstance>();
    const sub = () => {
      UploadRef.value?.submit();
    };
    const uploadSucceed: UploadProps["onSuccess"] = (res, file) => {
      loading.value.close();
      emit("onSucceed", res, file);
    };
    const uploadError: UploadProps["onError"] = (res, file) => {
      emit("onError", res, file);
      loading.value.close();
    };
    const loading = ref();
    const uploadBefore: UploadProps["beforeUpload"] = (res) => {
      loading.value = ElLoading.service({
        lock: true,
        background: "rgba(0, 0, 0, 0.3)",
      });
    };
    return {
      headers,
      baseApi,
      UploadRef,
      sub,
      uploadSucceed,
      uploadError,
      uploadBefore,
    };
  },
});
</script>

<style lang="less"></style>
