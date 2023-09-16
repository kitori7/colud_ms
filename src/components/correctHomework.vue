<template>
  <div class="correct">
    <el-dialog v-model="isDialog" title="批改作业">
      <template v-for="(item, index) in questionList" :key="item.id">
        <div class="item">
          <el-form-item :label="index + 1 + '、'" style="font-weight: 700">
            {{ item.questionContent }}
          </el-form-item>
          <p
            v-for="(option, oIndex) in item.homeworkQuestionOptions"
            :key="option.id"
            v-if="item.questionType !== '3'"
            :class="{
              option: true,
              pass: option.isAnswer === '1',
              current: option.isCurr,
            }"
          >
            {{
              oIndex === 0
                ? "A"
                : oIndex === 1
                ? "B"
                : oIndex === 2
                ? "C"
                : "D"
            }}、
            {{ option.optionContent }}
          </p>
          <div class="answer" v-if="item.questionType === '3'">
            <span>学生答案：</span>
            <span>{{ item.studentAnswer[0].questionAnswer }}</span>
          </div>
          <div class="score">
            <span
              >题型：{{
                item.questionType === "0"
                  ? "单选题"
                  : item.questionType === "1"
                  ? "多选题"
                  : item.questionType === "2"
                  ? "判断题"
                  : "简答题"
              }}</span
            >
            <span>总分：{{ item.score }}</span
            ><span v-if="item.questionType !== '3'"
              >得分：{{ item.currentScore }}</span
            >
            <span v-else
              >得分：<el-input-number
                :max="item.score"
                :min="0"
                size="small"
                v-model="item.currentScore"
              ></el-input-number
            ></span>
          </div>

          <span></span>
        </div>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSub"> 提交分数 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { listByHomeworkId, correctionHomework } from "@/request/api";
import { ElMessage } from "element-plus";

const isDialog = ref(false);
const questionList = ref();
const studentIdRef = ref<number>(0);
const homeworkIdRef = ref<number>(0);
function openDialog(homeworkId: number, studentId: number) {
  isDialog.value = true;
  studentIdRef.value = studentId;
  homeworkIdRef.value = homeworkId;
  listByHomeworkId(homeworkId, studentId).then((res) => {
    const list: any[] = res.data.data;
    list.forEach((item) => {
      const currentArr: any[] = item.studentAnswer;
      item.homeworkQuestionOptions.forEach((option: any) => {
        currentArr.forEach((currentOption) => {
          option.isCurr = currentOption.questionAnswer === option.optionContent;
        });
      });
    });
    questionList.value = list;
    console.log(questionList.value);
  });
}

//提交作业
const correctionForm = ref<any>({
  homeworkId: homeworkIdRef.value,
  studentId: studentIdRef.value,
  homeworkScores: [],
});
function handleSub() {
  let homeworkScoresArr: any[] = [];
  let flag = false;
  for (const item of questionList.value) {
    if (item.questionType === "3" && item.currentScore !== null) {
      homeworkScoresArr.push(item);
      flag = true;
    } else if (item.questionType === "3" && item.currentScore === null) {
      ElMessage.warning("请批改全部简答题");
      homeworkScoresArr = [];
      flag = false;
    }
  }
  if (flag) {
    for (const item of homeworkScoresArr) {
      const obj = {
        questionId: item.id,
        score: item.currentScore,
      };
      correctionForm.value.homeworkScores.push(obj);
      correctionForm.value.homeworkId = homeworkIdRef.value;
      correctionForm.value.studentId = studentIdRef.value;
    }
    correctionHomework(correctionForm.value).then((res) => {
      ElMessage.success("批改完成");
      isDialog.value = false;
    });
    console.log(correctionForm.value);
  }
}

defineExpose({ openDialog });
</script>
<style lang="less" scoped>
.correct {
  .item {
    padding: 20px;
    .option {
      line-height: 30px;
      padding-left: 15px;
      &.pass {
        color: green;
      }
      &.current {
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
          rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
      }
    }
    .score {
      margin-top: 8px;
      font-size: 16px;
      display: flex;
      justify-content: space-around;
    }
    .answer {
      padding: 20px;
    }
  }
}
</style>
