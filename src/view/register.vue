<template>
  <div class="register">
    <div class="content">
      <div class="w">
        <div class="title">
          <span :class="{ active: !isChange }" @click="onChange(false)"
            >学生注册
            <div class="line-box" v-show="!isChange">
              <span class="line"></span>
              <span>·</span>
              <span class="line"></span></div
          ></span>

          <span :class="{ active: isChange }" @click="onChange(true)"
            >教师注册
            <div class="line-box" v-show="isChange">
              <span class="line"></span>
              <span>·</span>
              <span class="line"></span></div
          ></span>
        </div>
        <div class="form-box">
          <el-form
            :model="regForm"
            label-position="top"
            ref="ruleFormRef"
            :rules="rules"
          >
            <el-form-item label="用户名" prop="userName" inline-message>
              <el-input v-model="regForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName" inline-message>
              <el-input v-model="regForm.nickName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" inline-message>
              <el-input v-model="regForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="学校" prop="schoolName" inline-message>
              <el-select v-model="regForm.schoolName" placeholder="请选择学校">
                <el-option
                  v-for="item in schoolList"
                  :key="item.id"
                  :label="item.schoolName"
                  :value="item.schoolName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn" @click="submitForm(ruleFormRef)">注册</div>
        <div class="reg">
          <router-link to="/login">
            已有账号？
            <span>点此登录！</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export interface userInfo {
  entity: 0 | 1;
  nickName: string;
  password: string;
  schoolName: string;
  userName: string;
  id?: number;
  status?: 0 | 1;
}
interface schoolItem {
  id: number;
  schoolName: string;
}
import { defineComponent, reactive, ref, Ref } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { getSchool, postReg } from "@/request/api";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    //路由
    const router = useRouter();
    //学生教师
    const isChange: Ref<boolean> = ref(false);
    const onChange = (type: boolean) => {
      isChange.value = type;
      type ? (regForm.entity = 1) : (regForm.entity = 0);
    };
    //获取学校列表
    const schoolList: Ref<Array<schoolItem>> = ref([]);
    getSchool().then((res) => {
      schoolList.value = res.data.data;
    });
    //表单
    const regForm: userInfo = reactive({
      userName: "",
      password: "",
      entity: 0,
      nickName: "",
      schoolName: "",
    });
    //表单规则验证
    const ruleFormRef = ref<FormInstance>();
    const CheckPassword = (rule: any, value: any, callback: any) => {
      const reg =
        /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/;
      const flag = reg.test(value);
      if (flag) {
        callback();
      } else {
        callback(new Error("密码密码应为字母，数字，特殊符号，两种及以上组合"));
      }
    };
    const rules = reactive<FormRules>({
      userName: [
        { required: true, message: "必填", trigger: "blur" },
        { min: 1, max: 10, message: "长度在1~10位之间", trigger: "blur" },
      ],
      password: [
        { required: true, message: "必填", trigger: "blur" },
        { min: 6, max: 16, message: "长度在6~16位之间", trigger: "blur" },
        { validator: CheckPassword, trigger: "blur" },
      ],
      nickName: [
        { required: true, message: "必填", trigger: "blur" },
        { min: 2, max: 5, message: "长度在2~5位之间", trigger: "blur" },
      ],
      schoolName: [{ required: true, message: "必填", trigger: "blur" }],
    });
    //注册按钮 验证表单
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //  发送注册请求
          postReg(regForm).then((res) => {
            if (res.data.code !== 500) {
              ElMessage.success(res.data.msg);
              router.push("/login");
            } else {
              ElMessage.error("注册失败");
            }
          });
        } else {
          console.log("error submit!", fields);
        }
      });
    };
    return {
      //学生教师
      isChange,
      onChange,
      //学校数据
      schoolList,
      //表单
      regForm,
      //表单规则验证
      rules,
      ruleFormRef,
      //注册按钮
      submitForm,
    };
  },
});
</script>

<style lang="less">
.register {
  width: 100vw;
  height: 100vh;
  background-color: #313131;
  background-image: url("@/assets/img/login-bg.svg");
  background-size: cover;
  .content {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    height: 500px;
    width: 500px;
    border-radius: 15px;
    background-color: #fefefe;
    margin: 0 auto;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    transform: translate(0, 25%);
    .w {
      margin: 0 70px;
      .title {
        display: flex;
        > span {
          cursor: pointer;
          position: relative;
          height: 50px;
          line-height: 50px;
          margin-top: 10px;
          flex: 1;
          font-size: 20px;
          text-align: center;
          color: #797979;
          &:nth-child(1) {
            border-right: 3px solid #6afaf5;
          }
          &.active {
            color: #303030;
          }
        }
        .line-box {
          position: absolute;
          bottom: -20px;
          left: 49px;
          color: #6afaf5;
          .line {
            display: inline-block;
            width: 25px;
            height: 1px;
            border-top: 2px solid #6afaf5;
            margin: 6px;
          }
        }
      }
      .form-box {
        margin-top: 30px;
        .check-pass {
          width: 60%;
        }
      }
      .btn {
        cursor: pointer;
        width: 100%;
        height: 40px;
        background-color: #6afaf5;
        color: #ecf5ff;
        text-align: center;
        line-height: 40px;
        font-size: 22px;
        border-radius: 15px;
        margin: 22px auto;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      }
      .reg {
        cursor: pointer;
        width: 100%;
        text-align: center;
        color: #6afaf5;
        height: 34px;
        a {
          color: #313131;
          &:visited {
            color: #313131;
          }
        }
        span {
          border-bottom: 1px solid #6afaf5;
        }
      }
    }
  }
}
</style>
