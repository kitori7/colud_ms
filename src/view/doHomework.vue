<template>
  <div class="homework">
    <div class="header">
      <div class="title">作业详情</div>
    </div>
    <div class="card">
      <div class="w">
        <div class="homework-title">
          <p>
            <b style="font-size: 22px"> {{ homeworkInfo.homeworkName }} </b>
          </p>
          <p>
            作答时间: {{ homeworkInfo.startTime }} 至 {{ homeworkInfo.endTime }}
          </p>
        </div>
        <div class="exercise">
          <el-empty
            description="暂无题目"
            v-if="quesList.length === 0"
          ></el-empty>
          <div
            v-else
            v-for="(item, index) in quesList"
            class="item"
            :key="index"
          >
            <p>
              <el-form-item :label="index + 1 + '、'"
                ><h1 class="content">
                  {{ item.questionContent }}
                </h1></el-form-item
              >
            </p>

            <template v-if="item.questionType === '3'"></template>
            <template v-else>
              <div>
                <el-form-item
                  :label="
                    oIndex === 0
                      ? 'A、'
                      : oIndex === 1
                      ? 'B、'
                      : oIndex === 2
                      ? 'C、'
                      : 'D、'
                  "
                  v-for="(option, oIndex) in item.homeworkQuestionOptions"
                >
                  <div>{{ option.optionContent }}</div>
                </el-form-item>
              </div>
            </template>
            <div class="choose">
              <WangEditor
                @getWangEditorValue="getValue"
                v-if="item.questionType === '3'"
                :item="item"
              ></WangEditor>
              <el-form-item label="你的选择：" v-else>
                <el-checkbox-group
                  v-model="item.answer"
                  v-if="item.questionType === '1'"
                  @change="checkboxChange(item)"
                >
                  <el-checkbox
                    :label="oIndex"
                    v-for="(options, oIndex) in item.homeworkQuestionOptions"
                    >{{
                      oIndex === 0
                        ? "A"
                        : oIndex === 1
                        ? "B"
                        : oIndex === 2
                        ? "C"
                        : "D"
                    }}</el-checkbox
                  >
                </el-checkbox-group>
                <el-radio-group
                  v-model="item.answer"
                  @change="checkboxChange(item)"
                  v-else
                >
                  <el-radio
                    :label="oIndex"
                    v-for="(options, oIndex) in item.homeworkQuestionOptions"
                    >{{
                      oIndex === 0
                        ? "A"
                        : oIndex === 1
                        ? "B"
                        : oIndex === 2
                        ? "C"
                        : "D"
                    }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="btns">
            <el-button type="primary" size="large" @click="handleCommit"
              >提交</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMain } from "@/store/home";
import { questionOptionToIsAnswer } from "@/utils/HomeworkList";
import type { IQuestion } from "@/view/useHomework.vue";
import { listByHomeworkId, addHomeworkAnswer } from "@/request/api";
import WangEditor from "@/components/WangEditor.vue";
import { ElMessage } from "element-plus";

interface IQuesLists extends IQuestion {
  answerObj?: IAnswers;
}

interface IAnswersList {
  homeworkId: number;
  questions: IAnswers[];
}

interface IAnswers {
  questionAnswers: string | string[];
  questionId: number;
  questionType: string;
}

const store = useMain();
const route = useRoute();
const { courseId, homeworkId } = route.params;
//获取标题时间
const { homeworkList } = store;
const homeworkInfo = ref({
  courseId: Number(courseId),
  endTime: "",
  homeworkName: "",
  startTime: "",
  id: Number(homeworkId),
});
homeworkInfo.value = homeworkList.find((item) => {
  return item.id === Number(homeworkId);
});
const quesList = ref<IQuesLists[]>([]);
onMounted(() => {
  listByHomeworkId(Number(homeworkId), -1).then((res) => {
    const list = questionOptionToIsAnswer(res.data.data);
    quesList.value = list;
  });
});

//提交作业

function checkboxChange(item: IQuesLists) {
  // IsAnswerToQuestionOption(quesList.value);.
  let answerObj: IAnswers = {
    questionAnswers: [],
    questionId: 0,
    questionType: "-1",
  };
  if (item.answer !== undefined && item.id) {
    if (typeof item.answer === "number") {
      answerObj = {
        questionAnswers: [
          item.homeworkQuestionOptions[item.answer].optionContent,
        ],
        questionId: item.id,
        questionType: item.questionType,
      };
    } else if (item.answer instanceof Array) {
      let ansArr: string[] = [];

      (item.answer as number[]).forEach((answer) => {
        ansArr.push(item.homeworkQuestionOptions[answer].optionContent);
      });
      answerObj = {
        questionAnswers: ansArr,
        questionId: item.id,
        questionType: item.questionType,
      };
    }
  }
  console.log(answerObj);
  item.answerObj = answerObj;
}

//富文本内容
function getValue(value: any, item: any) {
  item.answerObj = {
    questionAnswers: [value],
    questionId: item.id,
    questionType: item.questionType,
  };
}

function handleCommit() {
  const AnswersList: IAnswersList = {
    homeworkId: Number(homeworkId),
    questions: [],
  };
  quesList.value.forEach((item) => {
    if (item.answerObj) {
      AnswersList.questions.push(item.answerObj);
    }
  });
  if (quesList.value.length === AnswersList.questions.length) {
    addHomeworkAnswer(AnswersList).then((res) => {
      console.log(res.data);
      if (res.data == 200) {
        ElMessage.success("提交成功");
      } else {
        ElMessage.warning("提交失败");
      }
    });
  } else {
    ElMessage.warning("请填写全部题目~");
  }
}
</script>
<style lang="less" scoped>
.homework {
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
        transition: all 0.2s;
        .item {
          .el-form-item__content {
            display: flex;
            justify-content: space-between;
            div {
              display: flex;
            }
            .content {
              font-size: 20px;
            }
          }
          padding: 10px;
          margin-bottom: 20px;
          p {
            padding: 15px 0;
            font-size: large;
          }
        }
        .btns {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
