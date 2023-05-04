<template>
  <el-dialog v-model="isOpen" title="添加作业">
    <el-form>
      <el-form-item label="题目类型">
        <el-select placeholder="选择题目类型" v-model="type">
          <el-option label="选择题" :value="true" />
          <el-option label="论述题" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目">
        <el-input v-model="title"></el-input>
      </el-form-item>
      <template v-if="type">
        <el-form-item label="A：">
          <el-input v-model="x.a"></el-input>
        </el-form-item>
        <el-form-item label="B：">
          <el-input v-model="x.b"></el-input>
        </el-form-item>
        <el-form-item label="C：">
          <el-input v-model="x.c"></el-input>
        </el-form-item>
        <el-form-item label="D：">
          <el-input v-model="x.d"></el-input>
        </el-form-item>
        <el-form-item label="正确选项">
          <el-radio-group v-model="res">
            <el-radio label="A" />
            <el-radio label="B" />
            <el-radio label="C" />
            <el-radio label="D" />
          </el-radio-group>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button>上一题</el-button>
      <el-button @click="clean">下一题</el-button>
      <el-button type="primary" @click="sub">提交</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, ref } from "vue";
import WangEditor from "./WangEditor.vue";
export default defineComponent({
  components: { WangEditor },
  setup() {
    const isOpen = ref(false);
    const onOpen = () => {
      isOpen.value = true;
    };
    const type = ref(true);
    const res = ref();
    const sub = () => {
      ElMessage.success("提交成功");
      isOpen.value = false;
    };
    const x = ref({
      a: "",
      b: "",
      c: "",
      d: "",
    });
    const title = ref();
    const clean = () => {
      x.value = {
        a: "",
        b: "",
        c: "",
        d: "",
      };
      title.value = "";
      res.value = null;
    };
    return {
      isOpen,
      onOpen,
      type,
      res,
      sub,
      clean,
      x,
      title,
    };
  },
});
</script>
<style lang="less"></style>
