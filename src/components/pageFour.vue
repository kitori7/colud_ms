<template>
  <div class="page-four">
    <div class="item-content">
      <div class="item">
        <p>云平台资源测试</p>
        <el-progress
          :indeterminate="perCen[0].indeterminate"
          :percentage="perCen[0].pc"
          :status="perCen[0].sa"
          :show-text="false"
        />
      </div>
      <div class="item">
        <p>镜像下载测试</p>
        <el-progress
          :indeterminate="perCen[1].indeterminate"
          :percentage="perCen[1].pc"
          :status="perCen[1].sa"
          :show-text="false"
        />
      </div>
      <div class="item">
        <p>POD创建测试</p>
        <el-progress
          :indeterminate="perCen[2].indeterminate"
          :percentage="perCen[2].pc"
          :status="perCen[2].sa"
          :show-text="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, Ref } from "@vue/runtime-core";
import { useMain } from "@/store/home";
import { isPodCreate, isImagePull, isResourcesEnough } from "@/request/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { IRuleForm } from "./TestCart.vue";
interface IPerCen {
  pc: number;
  sa: string;
  indeterminate: boolean;
}
export default defineComponent({
  emits: ["flags", "wrongFlags"],
  setup(props, context) {
    // pinia
    const store = useMain();
    const args = store.ruleForm;
    onMounted(() => {
      const arr = (args as IRuleForm).image.split(":");
      const {
        environment,
        limitsCpu,
        limitsMemory,
        requestsCpu,
        requestsMemory,
        count,
      } = args as IRuleForm;
      //三联请求
      isResourcesEnough(count, limitsCpu, limitsMemory).then((res) => {
        //第一个通过
        if (res.data.data.key) {
          ElMessage.success(res.data.data.value);
          timeSuccess(0);
          isImagePull(arr[0], arr[1]).then((res) => {
            //第二个通过
            if (res.data.data.key) {
              ElMessage.success(res.data.data.value);
              timeSuccess(1);
              isPodCreate({
                environment: JSON.parse(JSON.stringify(environment)),
                limitsCpu,
                limitsMemory,
                requestsCpu,
                requestsMemory,
                imageName: arr[0],
                tagName: arr[1],
              }).then((res) => {
                //第三个通过
                if (res.data.isSuccess) {
                  ElMessage.success(res.data.info);
                  context.emit("flags");
                  timeSuccess(2);
                } else {
                  ElMessageBox.confirm(res.data.errInfo, res.data.info, {
                    confirmButtonText: "了解",
                    showCancelButton: false,
                  }).then((res) => {
                    context.emit("wrongFlags");
                  });
                  timeWrong(2);
                }
              });
            } else {
              ElMessage.error(res.data.data.value);
              timeWrong(1);
            }
          });
        } else {
          ElMessage.error(res.data.data.value);
          timeWrong(0);
        }
      });

      //
    });
    // 炫酷

    const perCen: Ref<Array<IPerCen>> = ref([
      { pc: 50, sa: "", indeterminate: true },
      { pc: 50, sa: "", indeterminate: true },
      { pc: 50, sa: "", indeterminate: true },
    ]);
    const timeSuccess = (index: number) => {
      perCen.value[index].pc = 100;
      perCen.value[index].sa = "success";
      perCen.value[index].indeterminate = false;
    };
    const timeWrong = (index: number) => {
      perCen.value[index].pc = 100;
      perCen.value[index].sa = "exception";
      perCen.value[index].indeterminate = false;
    };
    return {
      perCen,
    };
  },
});
</script>

<style lang="less">
.page-four {
  .item-content {
    width: 100%;
    height: 200px;
    padding: 40px;
    text-align: left;
    .item {
      p {
        margin-bottom: 20px;
        text-align: left;
      }
    }
  }
}
</style>