<template>
  <div class="use-homework">
    <div class="header">
      <div class="title">作业详情</div>
    </div>
    <div class="card">
      <div class="w">
        <div class="homework-title">
          <p><b style="font-size: 22px">2023.1.10日作业</b></p>
          <p>作答时间:2022-12-18 17:00 至 2022-12-28 18:00</p>
        </div>
        <div class="exercise">
          <div class="item">
            <p>1、2022年12月28日期末考试答卷收集。</p>
            <el-radio-group v-model="from.test" class="ml-4">
              <el-radio label="1" size="large">A</el-radio>
              <el-radio label="2" size="large">B</el-radio>
              <el-radio label="3" size="large">C</el-radio>
              <el-radio label="4" size="large">D</el-radio>
            </el-radio-group>
          </div>
          <div class="item">
            <p>1、2022年12月28日期末考试答卷收集。</p>
            <wang-editor @getWangEditorValue="getValue"></wang-editor>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, reactive } from "vue";
import WangEditor from "@/components/WangEditor.vue";
export default defineComponent({
  name: "useHomework",
  components: {
    WangEditor,
  },
  setup() {
    const from = reactive({
      test: "",
    });
    //富文本内容
    const getValue = (e: string) => {
      console.log(e);
    };
    return {
      from,
      getValue,
    };
  },
});
</script>
  
<style lang="less">
.use-homework {
  width: 100%;
  height: 86.6vh;
  overflow: auto;
  .header {
    height: 45px;
    background-color: #337ecc;
    .title {
      text-align: center;
      line-height: 45px;
      font-size: 25px;
      font-weight: 700;
      color: #fff;
    }
  }
  .card {
    margin: 0 auto;
    .w {
      margin: 0 200px;
      background-color: #fff;
      .homework-title {
        padding: 20px;
        margin: 0 40px;
        height: 100px;
        line-height: 40px;
        font-size: 16px;
        border-bottom: 1px solid #666;
      }
      .exercise {
        padding: 50px 40px;
        .item {
          // height: 50px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>