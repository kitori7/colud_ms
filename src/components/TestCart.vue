<template>
  <el-dialog
    v-model="isDialogOpen"
    :title="isChange ? '修改实训' : '添加实训'"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <el-progress :percentage="percent" text-inside :stroke-width="20" />
    <template v-if="page == 1">
      <el-form ref="ruleFormRef" :model="ruleForm">
        <el-form-item required label="实训名称">
          <el-input v-model="ruleForm.pjtName"></el-input>
        </el-form-item>
        <el-form-item label="实训描述">
          <el-input v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item required label="结束时间">
          <el-config-provider :locale="zhCn">
            <el-date-picker
              :disabled-date="disabledDateFun"
              type="datetime"
              placeholder="实训结束时间"
              v-model="ruleForm.endTime"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-config-provider>
        </el-form-item>
      </el-form>
    </template>
    <template v-if="page === 2"><pageTwo ref="pageTwo"></pageTwo></template>
    <template v-if="page === 3"
      ><pageThree ref="pageThree"></pageThree>
    </template>
    <template v-if="page === 4"
      ><pageFour
        ref="pageFour"
        @flags="formFlag"
        @wrongFlags="formWrongFlag"
      ></pageFour
    ></template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onNext(false)" :disabled="preDis">{{
          preBtn
        }}</el-button>
        <el-button type="primary" @click="onNext(true)" :disabled="nextDis">
          {{ nextBtn }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { ElMessage, FormInstance, ElLoading, ElMessageBox } from "element-plus";
import { useMain } from "@/store/home";
import { useRoute } from "vue-router";
import { isTestName, isConflict, getImgInfo } from "@/request/api";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { Search } from "@element-plus/icons-vue";
import pageTwo from "@/components/pageTwo.vue";
import pageThree from "@/components/pageThree.vue";
import type { IEnvList } from "@/components/pageThree.vue";
import pageFour from "@/components/pageFour.vue";
//dayjs
import dayjs from "dayjs";
import { addPjt, pjtInfo, changePjt } from "@/request/api";

export interface IRuleForm {
  pjtName: string;
  description: string;
  endTime: string;
  startTime: string;
  count: number;
  existTime: number;
  environment: string | IEnvList;
  image: string;
  courseId: number;
  limitsCpu: number;
  requestsCpu: number;
  limitsMemory: number;
  requestsMemory: number;
  createBy?: null | string;
}
export default defineComponent({
  components: {
    pageTwo,
    pageThree,
    pageFour,
  },
  emits: ["onCartClose"],
  setup(props, { emit }) {
    const disabledDateFun = (time: Record<string, any>) => {
      if (time.getTime() < new Date().getTime()) {
        return time.getTime() < Date.now();
      }
    };
    const isDialogOpen = ref(false);
    // pinia
    const store = useMain();
    //route
    const route = useRoute();

    const ruleFormRef = ref<FormInstance>();
    const ruleForm: Ref<IRuleForm> = ref({
      pjtName: "",
      description: "",
      endTime: "",
      startTime: "",
      count: 1,
      existTime: 30,
      environment: "",
      image: "",
      courseId: Number(route.params.id),
      limitsCpu: 150,
      requestsCpu: 100,
      limitsMemory: 800,
      requestsMemory: 300,
    });
    //打开关闭
    const pjtIdRef = ref(0);
    const isChange = ref(false);
    const onOpen = (pjtId: number) => {
      pjtIdRef.value = pjtId;
      if (pjtId === 0) {
        isDialogOpen.value = true;
      } else {
        isChange.value = true;
        pjtInfo(pjtId).then((res) => {
          isDialogOpen.value = true;
          ruleForm.value = res.data.data;
          store.ruleForm = res.data.data;
        });
      }
    };
    const onClose = () => {
      ruleForm.value = {
        pjtName: "",
        description: "",
        endTime: "",
        startTime: "",
        count: 0,
        existTime: 30,
        environment: "",
        image: "",
        courseId: Number(route.params.id),
        limitsCpu: 150,
        requestsCpu: 100,
        limitsMemory: 800,
        requestsMemory: 300,
      };
      isDialogOpen.value = false;
      page.value = 1;
      percent.value = 0;
      preBtn.value = "取消";
      nextBtn.value = "下一步";
      preDis.value = false;
      nextDis.value = false;
      store.ruleForm = ruleForm.value;
      isChange.value = false;
      emit("onCartClose");
    };
    // 提交表单
    //进度条
    const percent = ref(0);
    const page = ref(1);
    //第二页
    const pageTwo = ref();
    //第三页
    const pageThree = ref();
    //第四页
    const pageFour = ref();
    const isFormFlag = ref(false);
    const formFlag = () => {
      percent.value = 100;
      nextDis.value = false;
      nextBtn.value = "完成";
      isFormFlag.value = true;
    };
    const formWrongFlag = () => {
      percent.value = 75;
      nextDis.value = true;
      preDis.value = false;
    };
    //切换步骤
    const preBtn = ref("取消");
    const nextBtn = ref("下一步");
    const nextDis = ref(false);
    const preDis = ref(false);
    const onNext = async (isNext: boolean) => {
      console.log(ruleForm.value);
      if (isNext) {
        //下一页

        if (page.value === 1) {
          if (isChange.value) {
            isConflict(
              ruleForm.value.pjtName,
              Number(route.params.id),
              pjtIdRef.value
            ).then((res) => {
              if (res.data.data.key) {
                page.value++;
                percent.value = 25;
                preBtn.value = "上一步";
              } else {
                ElMessage.warning("已存在名称相同的实训");
              }
            });
          } else {
            const res = (
              await isTestName(ruleForm.value.pjtName, Number(route.params.id))
            ).data;
            if (
              res.data === "0" &&
              ruleForm.value.pjtName &&
              ruleForm.value.endTime
            ) {
              page.value++;
            } else if (!(ruleForm.value.pjtName && ruleForm.value.endTime)) {
              ElMessage.warning("内容不能为空");
            } else if (res.data === "1") {
              ElMessage.warning("实训名称已存在");
            }
          }
        } else if (page.value === 2) {
          if (pageTwo.value.mirror && pageTwo.value.tag) {
            ruleForm.value.image = `${pageTwo.value.mirror}:${pageTwo.value.tag}`;
            getImgInfo(pageTwo.value.mirror, pageTwo.value.tag).then((res) => {
              //todo
              // console.log(res.data.data.environment);
              if (res.data.data.key) {
                ruleForm.value.environment = res.data.data.value.environment;
                store.ruleForm.environment = res.data.data.value.environment;
              }
              page.value++;
            });
          } else {
            ElMessage.warning("请选择镜像和标签");
          }
        } else if (page.value === 3) {
          const {
            count,
            existTime,
            limitsCpu,
            requestsCpu,
            limitsMemory,
            requestsMemory,
          } = pageThree.value.ruleForm;
          ruleForm.value.count = count;
          ruleForm.value.existTime = existTime;
          ruleForm.value.limitsCpu = limitsCpu;
          ruleForm.value.requestsCpu = requestsCpu;
          ruleForm.value.limitsMemory = limitsMemory;
          ruleForm.value.requestsMemory = requestsMemory;
          ruleForm.value.environment = pageThree.value.envList;
          store.ruleForm = ruleForm.value;
          //现在时间
          ruleForm.value.startTime = dayjs(`${new Date()}`).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          page.value++;
          nextDis.value = true;
          preDis.value = true;
        } else if (page.value === 4) {
          const loading = ElLoading.service();
          if (isChange.value) {
            ElMessageBox.confirm(
              "更新实训将会删除所有学生实例，请提醒学生保存数据",
              "警告",
              {
                confirmButtonText: "确认修改",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                changePjt(ruleForm.value).then((res) => {
                  if (res.data.data.key) {
                    ElMessage.success(res.data.data.value);
                    onClose();
                  } else {
                    preDis.value = false;
                    ElMessage.warning(res.data.data.value);
                  }
                  loading.close();
                });
              })
              .catch(() => {
                loading.close();
              });
          } else {
            addPjt(ruleForm.value).then((res) => {
              if (res.data.data.key) {
                ElMessage.success(res.data.data.value);
                onClose();
              } else {
                preDis.value = false;
                ElMessage.warning(res.data.data.value);
              }
              loading.close();
            });
          }
          //todo
        }
      } else {
        //上一页
        if (page.value === 1) {
          onClose();
        } else {
          page.value--;
        }
      }

      switch (page.value) {
        case 1:
          percent.value = 0;
          preBtn.value = "取消";
          nextBtn.value = "下一步";
          break;
        case 2:
          percent.value = 25;
          preBtn.value = "上一步";
          nextBtn.value = "下一步";
          break;
        case 3:
          percent.value = 50;
          preBtn.value = "上一步";
          nextBtn.value = "下一步";
          break;
        case 4:
          percent.value = 75;
          if (isFormFlag.value) {
            percent.value = 100;
          }
          break;
      }
    };

    return {
      disabledDateFun,
      zhCn,
      Search,
      isDialogOpen,
      ruleFormRef,
      ruleForm,
      onClose,
      onOpen,
      //进度条
      percent,
      page,
      nextDis,
      preDis,
      //第二页
      pageTwo,
      pageThree,
      pageFour,
      formFlag,
      formWrongFlag,
      // 切换步骤
      preBtn,
      nextBtn,
      onNext,
      isChange,
    };
  },
});
</script>
<style lang="less">
.el-progress-bar {
  margin-bottom: 15px;
}
// .el-form {
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-around;
// }
// .el-form-item {
//   // flex: 1;
//   // margin: 20px !important;
// }
</style>
