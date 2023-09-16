<template>
  <div class="student">
    <div class="header">
      <div class="title">批改作业</div>
    </div>
    <div class="card">
      <div class="w">
        <div class="homework-title">
          <p>
            <b style="font-size: 22px">{{ homeworkInfo.homeworkName }}</b>
          </p>
          <p>
            作答时间: {{ homeworkInfo.startTime }} 至 {{ homeworkInfo.endTime }}
          </p>
        </div>
        <div class="content">
          <div class="tabs">
            <h1 :class="{ active: isFinish }" @click="isFinish = true">
              已完成({{ finishNumber }})
            </h1>
            <span></span>
            <h1 :class="{ active: !isFinish }" @click="isFinish = false">
              未完成({{ unFinishNumber }})
            </h1>
          </div>

          <div class="item-content" v-show="isFinish">
            <div
              class="item"
              v-for="item in finishArr"
              @click="handelItem(item.studentId)"
            >
              <el-icon size="40px"><User /></el-icon>
              <span> {{ item.studentName }}</span>
              <span> {{ item.completeTime.substr(5, 11) }}</span>
            </div>
          </div>
          <div class="item-content" v-show="!isFinish">
            <div class="item" v-for="item in unFinishArr">
              <el-icon size="40px"><User /></el-icon>
              <span> {{ item.studentName }}</span>
              <span>未完成</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CorrectHomework ref="correctRef"></CorrectHomework>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMain } from "@/store/home";
import { listStuHomework } from "@/request/api";
import { User } from "@element-plus/icons-vue";
import CorrectHomework from "@/components/correctHomework.vue";

const store = useMain();
const route = useRoute();
const router = useRouter();
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

//拉列表
const finishArr = ref();
const unFinishArr = ref();
const finishNumber = ref(0);
const unFinishNumber = ref(0);
listStuHomework(Number(courseId), Number(homeworkId)).then((res) => {
  const result = res.data.data;
  finishArr.value = result.finishStudentHomework;
  unFinishArr.value = result.unfinishedStudentHomework;
  finishNumber.value = result.finishNumber;
  unFinishNumber.value = result.unfinishedNumber;
  console.log(unFinishArr.value);
});
const isFinish = ref(true);

//批改作业对话框
const correctRef = ref<InstanceType<typeof CorrectHomework>>();
function handelItem(studentId: number) {
  correctRef.value?.openDialog(Number(homeworkId), studentId);
}
</script>
<style lang="less" scoped>
.student {
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
      overflow: auto;
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
      .content {
        margin: 0px 150px;
        padding: 5px;
        text-align: center;
        .tabs {
          display: flex;
          justify-content: space-around;
          padding: 10px;

          // box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          span {
            display: inline-block;
            height: 20px;
            width: 1px;
            background-color: #999;
          }
          h1 {
            text-align: center;
            flex: 1;
            font-size: 20px;
            font-weight: 700;
            color: #666;
            cursor: pointer;
            &.active {
              color: #409eff;
              position: relative;
              &::after {
                position: absolute;
                content: "";
                width: 120px;
                bottom: -7px;
                height: 3px;
                left: 50%;
                transform: translate(-50%, 0);
                background-color: #409eff;
              }
            }
          }
        }
        .item-content {
          margin: 30px 0;
          padding: 20px 50px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
          display: flex;
          border-radius: 8px;
          .item {
            width: 130px;
            cursor: pointer;
            display: flex;
            height: 100px;
            padding: 10px;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
              rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
            border-radius: 20px;
            margin: 10px 20px;
            transition: all 0.2s;
            span {
              display: flex;
              flex: 1;
              justify-content: center;
              align-items: center;
            }
            &:hover {
              box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;
              color: #409eff;
            }
          }
          .un {
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
