<template>
  <el-form ref="ruleFormRef2" :model="ruleForm" label-position="right" inline>
    <el-form-item label="容器数量（个）">
      <el-input-number
        v-model="ruleForm.count"
        :max="studentNumber"
        :min="1"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="CPU上限（m）">
      <el-input-number
        v-model="ruleForm.limitsCpu"
        :max="200"
        :min="ruleForm.requestsCpu"
        :step="1"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="内存上限（Mi）">
      <el-input-number
        v-model="ruleForm.limitsMemory"
        :max="1000"
        :min="ruleForm.requestsMemory"
        :step="10"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="存在时间（分）">
      <el-input-number
        v-model="ruleForm.existTime"
        :max="120"
        :min="30"
        :step="10"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="CPU下限（m）">
      <el-input-number
        v-model="ruleForm.requestsCpu"
        :max="ruleForm.limitsCpu"
        :min="1"
        :step="1"
      ></el-input-number>
    </el-form-item>

    <el-form-item label="内存下限（Mi）">
      <el-input-number
        v-model="ruleForm.requestsMemory"
        :max="ruleForm.limitsMemory"
        :min="10"
        :step="10"
      ></el-input-number>
    </el-form-item>

    <div class="env-content">
      <div class="title">
        <span>环境变量</span>
        <div>
          <el-button type="primary" size="small" @click="onAdd">增加</el-button>
          <el-button size="small" @click="onDelete">删除</el-button>
        </div>
      </div>
      <table>
        <tr v-for="(value, key, index) in envList" :key="key">
          <td>
            <el-input
              type="text"
              v-model="keyArr[index]"
              @blur="keyChange(key, value, index)"
            />
          </td>
          <td><el-input type="text" v-model="envList[key]" /></td>
        </tr>
      </table>
    </div>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { useMain } from "@/store/home";
import { ElMessage } from "element-plus";
export interface IEnvList {
  [key: string]: string;
}
interface IThreeFrom {
  count: number;
  existTime: number;
  limitsCpu: number;
  requestsCpu: number;
  limitsMemory: number;
  requestsMemory: number;
  environment: IEnvList | string;
}
export default defineComponent({
  setup() {
    const ruleForm: Ref<IThreeFrom> = ref({
      count: 1,
      existTime: 30,
      limitsCpu: 150,
      requestsCpu: 100,
      limitsMemory: 800,
      requestsMemory: 300,
      environment: {},
    });
    //pinia
    const envList: Ref<IEnvList> = ref({});
    const keyArr: Ref<Array<string>> = ref([]);
    const store = useMain();
    const { classInfo } = store;
    const { studentNumber } = classInfo;
    onMounted(() => {
      if (
        JSON.stringify(store.ruleForm) !== "{}" &&
        JSON.stringify(store.ruleForm) !== ""
      ) {
        const {
          count,
          existTime,
          limitsCpu,
          requestsCpu,
          limitsMemory,
          requestsMemory,
          environment,
        } = store.ruleForm;
        ruleForm.value = {
          count,
          existTime,
          limitsCpu,
          requestsCpu,
          limitsMemory,
          requestsMemory,
          environment,
        };
        if (environment.length !== 0) {
          envList.value = JSON.parse(environment as string);
        } else {
          envList.value = {};
        }
      } else {
        envList.value = {};
      }
      for (let key in envList.value as IEnvList) {
        keyArr.value.push(key);
      }
    });

    const keyChange = (key: string | number, value: string, index: number) => {
      let flag = true;
      for (let i = keyArr.value.length - 1; i >= 0; i--) {
        if (
          keyArr.value.indexOf(keyArr.value[i]) !=
          keyArr.value.lastIndexOf(keyArr.value[i])
        ) {
          ElMessage.warning("不能填写相同的环境变量");
          flag = false;
          Reflect.deleteProperty(envList.value, key);
          keyArr.value.pop();
        }
      }
      if (flag) {
        Reflect.deleteProperty(envList.value, key);
        envList.value[keyArr.value[index]] = value;
        console.log(keyArr.value);
      }
    };
    const onAdd = () => {
      let flag = true;
      for (let key in envList.value) {
        if (envList.value[key] === "") {
          flag = false;
          ElMessage.warning("请填写变量");
        } else {
          flag = true;
        }
      }
      if (flag) {
        envList.value[""] = "";
        keyArr.value.push("");
      }
    };
    const onDelete = () => {
      Reflect.deleteProperty(
        envList.value,
        keyArr.value[keyArr.value.length - 1]
      );
      keyArr.value.pop();
    };
    return {
      ruleForm,
      studentNumber,
      keyChange,
      keyArr,
      onAdd,
      onDelete,
      envList,
    };
  },
});
</script>

<style lang="less">
.env-content {
  width: 65%;
  .title {
    display: flex;
    justify-content: space-between;
  }
  table {
    display: flex;
    flex-wrap: nowrap;
    display: block;
    margin: 0 auto;
    tr {
      width: 100%;
      display: flex;

      th {
        flex: 1;
        width: 23px;
        padding: 8px 0;
        border-bottom: 1px solid #ebeef5;
      }
      td {
        text-align: center;
        flex: 1;
        width: 23px;
        padding: 5px 0;
        border-bottom: 1px solid #ebeef5;
        &:first-child {
          border-right: 1px solid #ebeef5;
        }
      }
    }
  }
}
</style>
