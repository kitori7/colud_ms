<template>
  <div class="resource">
    <div class="title">资源监控</div>
    <div class="item">
      <div class="memory">{{ podRes.usedCpu }} / {{ podRes.limitsCpu }} m</div>
      <span class="ids">CPU</span
      ><span>
        <el-progress
          :stroke-width="25"
          :percentage="podRes.pcpu"
          :format="cpuFormat"
          :color="customColors"
      /></span>
    </div>
    <div class="item">
      <div class="memory">
        {{ podRes.usedMemory }} / {{ podRes.limitsMemory }} Mi
      </div>
      <span class="ids">内存</span
      ><span>
        <el-progress
          :stroke-width="25"
          :percentage="podRes.pmemory"
          :color="customColors"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "@vue/runtime-core";
import { podResources } from "@/request/api";
interface IPodRes {
  limitsCpu: number;
  limitsMemory: number;
  nameSpace: string;
  pcpu: number;
  pmemory: number;
  podName: string;
  usedCpu: number;
  usedMemory: number;
}
export default defineComponent({
  props: {
    podId: {
      type: Number,
      required: true,
    },
    pjtId: {
      type: Number,
      required: true,
    },
  },
  setup({ pjtId, podId }) {
    let timer: any = null;
    const podRes: Ref<IPodRes> = ref({
      limitsCpu: 0,
      limitsMemory: 0,
      nameSpace: "string",
      pcpu: 0,
      pmemory: 0,
      podName: "string",
      usedCpu: 0,
      usedMemory: 0,
    });
    const customColors = [
      { color: "#f56c6c", percentage: 100 },
      { color: "#e6a23c", percentage: 80 },
      { color: "#5cb87a", percentage: 60 },
      { color: "#1989fa", percentage: 40 },
      { color: "#6f7ad3", percentage: 20 },
    ];
    onMounted(() => {
      getRes();
      timer = setInterval(getRes, 1000);
    });
    const getRes = () => {
      podResources(pjtId, podId).then((res) => {
        const data = res.data.data;
        if (data.pcpu > 100) data.pcpu = 100;
        if (data.pmemory > 100) data.pmemory = 100;
        podRes.value = data;
      });
    };
    const cpuFormat = (percentage: number) => {
      if (percentage === 100) {
        return `${podRes.value.pcpu}%`;
      } else {
        return `${percentage}%`;
      }
    };
    return {
      podRes,
      customColors,
      cpuFormat,
    };
  },
});
</script>

<style lang="less">
.resource {
  border: 5px solid #333;
  border-radius: 8px;
  margin: 20px;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  background-color: #fff;
  .title {
    font-size: 16px;
    font-weight: 700;
  }
  .item {
    margin-top: 18px;
    display: flex;
    line-height: 25px;
    position: relative;
    .el-progress__text {
      transform: translate(5px, -7px);
      font-size: 18px !important;
    }
    .ids {
      flex: 1;
      font-size: 18px;
    }
    span {
      flex: 6;
    }
    .memory {
      position: absolute;
      z-index: 9;
      left: 3.5vw;
      font-size: 8px;
      font-weight: 700;
      top: 0px;
    }
  }
}
</style>
