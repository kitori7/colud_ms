<template>
  <div class="use-homework">
    <div class="header">
      <div class="title">作业详情</div>
    </div>
    <div class="card">
      <div class="w">
        <div class="homework-title">
          <p>
            <b style="font-size: 22px">{{ homeworkInfo.homeworkName }}</b>
          </p>
          <p>
            作答时间:{{ homeworkInfo.startTime }} 至 {{ homeworkInfo.endTime }}
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
                ><el-input
                  v-model="item.questionContent"
                  type="textarea"
                  placeholder="请输入题目"
              /></el-form-item>
              <el-form-item label="题目类型：" class="item-controller"
                ><el-select
                  v-model="item.questionType"
                  @change="selectChange(item)"
                >
                  <el-option label="选择题" value="0"></el-option>
                  <el-option label="多选题" value="1"></el-option>
                  <el-option label="判断题" value="2"></el-option>
                  <el-option label="简答题" value="3"></el-option>
                </el-select>
                <div v-show="item.questionType !== '3'">
                  <span class="title">正确选项：</span>
                  <el-checkbox-group
                    v-model="item.answer"
                    v-if="item.questionType === '1'"
                    @change="checkboxChange"
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
                    @change="checkboxChange"
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
                </div>
                <div>
                  <span class="title">分数：</span>
                  <el-input-number
                    v-model="item.score"
                    :min="1"
                    :max="100"
                  ></el-input-number>
                </div>
                <div>
                  <el-button
                    type="danger"
                    @click="handleDeleOption(item, index)"
                    >删除题目</el-button
                  >
                </div>
              </el-form-item>
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
                  <el-input
                    v-model="option.optionContent"
                    placeholder="请输入选项内容"
                  ></el-input>
                </el-form-item>
              </div>
            </template>
          </div>
          <div class="btns">
            <el-button size="large" type="primary" @click="handleAddQues"
              >添加题目</el-button
            >
            <el-button size="large" type="success" @click="handlePushQues"
              >提交</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import WangEditor from "@/components/WangEditor.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useMain } from "@/store/home";
import { useRoute } from "vue-router";
import {
  listByHomeworkId,
  postOperationHomework,
  deleteQuestion,
} from "@/request/api";
import {
  questionOptionToIsAnswer,
  IsAnswerToQuestionOption,
} from "@/utils/HomeworkList";
interface IQuesOption {
  homeworkQuestionId: null | number;
  id: null | number;
  isAnswer: "0" | "1";
  optionContent: string;
}
export interface IQuestion {
  homeworkQuestionOptions: IQuesOption[];
  id: null | number;
  questionContent: string;
  questionOrder: number;
  questionType: "0" | "1" | "2" | "3";
  score: number;
  answer?: number | number[];
}
export interface IQuesList {
  homeworkQuestionList: IQuestion[];
  courseId: number;
  homeworkId: number;
}
export default defineComponent({
  name: "useHomework",
  components: {
    WangEditor,
  },
  setup() {
    //store
    const store = useMain();
    //route
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

    //第一次拉内容
    const quesList = ref<IQuestion[]>([]);
    onMounted(() => {
      listByHomeworkId(Number(homeworkId), -1).then((res) => {
        quesList.value = questionOptionToIsAnswer(res.data.data);
      });
    });
    const checkboxChange = () => {
      IsAnswerToQuestionOption(quesList.value);
    };
    const selectChange = (item: IQuestion) => {
      if (item.questionType === "1") {
        item.answer = [0];
        item.homeworkQuestionOptions = [
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "0",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
        ];
      } else if (item.questionType === "2") {
        item.homeworkQuestionOptions = [
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "0",
            optionContent: "",
          },
        ];
        item.answer = 0;
      } else if (item.questionType === "3") {
        item.homeworkQuestionOptions = [];
      } else {
        item.answer = 0;
        item.homeworkQuestionOptions = [
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "0",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
        ];
      }
    };

    //添加选项
    const handleAddOption = (item: IQuestion) => {
      if (item.homeworkQuestionOptions.length < 4) {
        item.homeworkQuestionOptions.push({
          homeworkQuestionId: null,
          id: null,
          isAnswer: "0",
          optionContent: "",
        });
      } else {
        ElMessage.warning("最多四个选项");
      }
    };
    //删除题目
    const handleDeleOption = (item: IQuestion, index: number) => {
      if (item.id) {
        deleteQuestion(item.id).then((res) => {
          quesList.value.splice(index, 1);
          ElMessage.success("删除成功");
        });
      }
    };
    //添加题目
    const handleAddQues = () => {
      quesList.value.push({
        homeworkQuestionOptions: [
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "1",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "0",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "0",
            optionContent: "",
          },
          {
            homeworkQuestionId: null,
            id: null,
            isAnswer: "0",
            optionContent: "",
          },
        ],
        id: null,
        questionContent: "",
        questionOrder: 1,
        questionType: "0",
        score: 10,
        answer: 0,
      });
    };

    // 提交
    const handlePushQues = () => {
      let flag = false;
      let optionHas = true;
      quesList.value.forEach((item) => {
        if (optionHas) {
          optionHas = item.homeworkQuestionOptions.every((option) => {
            return option.optionContent.length !== 0;
          });
        }
        flag = optionHas && item.questionContent.length !== 0;
      });
      if (flag) {
        postOperationHomework({
          homeworkQuestionList: quesList.value,
          courseId: Number(courseId),
          homeworkId: Number(homeworkId),
        }).then((res) => {
          if (res.data.data == undefined) {
            ElMessage.success("添加成功");
          } else {
            ElMessage.warning(res.data.data.value);
          }
        });
      } else {
        ElMessage.warning("请输入完整内容");
      }
    };
    return {
      homeworkInfo,
      quesList,
      handleAddOption,
      handleDeleOption,
      handleAddQues,
      handlePushQues,
      checkboxChange,
      selectChange,
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
        transition: all 0.2s;
        .item {
          .el-form-item__content {
            display: flex;
            justify-content: space-between;
            div {
              display: flex;
            }
            .title {
              font-size: 18px;
              color: #606266;
            }
            .el-radio-group {
              .el-radio {
                margin-right: 5px;
              }
            }
            .el-checkbox-group {
              .el-checkbox {
                margin-right: 5px;
              }
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
