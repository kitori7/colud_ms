<template>
  <div class="use-homework">
    <div class="header">
      <div class="title">作业详情</div>
    </div>
    <div class="card">
      <div class="w">
        <div class="homework-title">
          <el-button
            type="primary"
            @click="sub"
            style="position: absolute; right: 300px"
            >提交</el-button
          >
          <p><b style="font-size: 22px">第一章作业</b></p>
          <p>作答时间:2023-03-30 22:00 至 2023-03-35 22:30</p>
        </div>
        <div class="exercise">
          <div class="item">
            <p>1、测试选择题</p>
            <el-radio-group v-model="from.test" size="small">
              <el-radio border label="1" size="large">A：A</el-radio>
              <el-radio border label="2" size="large">B：B</el-radio>
              <el-radio border label="3" size="large">C：C</el-radio>
              <el-radio border label="4" size="large">D：D</el-radio>
            </el-radio-group>
          </div>
          <div class="item">
            <p>1、测试简答题</p>
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
import { ElMessageBox } from "element-plus";
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
    const sub = () => {
      ElMessageBox.confirm("确认提交？", "提交作业", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(() => {
        window.close();
      });
    };
    return {
      from,
      getValue,
      sub,
    };
  },
});
</script>

<style lang="less">
.use-homework {
  width: 100%;
  height: 100vh;
  overflow: auto;
  .header {
    height: 45px;
    background-color: #313131;
    .title {
      text-align: center;
      line-height: 45px;
      font-size: 25px;
      font-weight: 700;
      color: #fff;
    }
  }
  .card {
    margin: 30px auto;

    .w {
      margin: 0 200px;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
        rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
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
          .el-radio-group {
            display: flex;
            flex-direction: column;
            align-items: start;
            .el-radio {
              margin: 8px 15px;
            }
          }
          // height: 50px;
          padding: 10px;
          margin-bottom: 20px;
          p {
            padding: 15px 0;
            font-size: large;
          }
        }
      }
    }
  }
}
</style>
