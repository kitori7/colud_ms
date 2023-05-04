<template>
  <div class="login">
    <div class="content">
      <div class="w">
        <div class="title">
          <span :class="{ active: !isChange }" @click="onChange(false)"
            >学生登录
            <div class="line-box" v-show="!isChange">
              <span class="line"></span>
              <span>·</span>
              <span class="line"></span></div
          ></span>

          <span :class="{ active: isChange }" @click="onChange(true)"
            >教师登录
            <div class="line-box" v-show="isChange">
              <span class="line"></span>
              <span>·</span>
              <span class="line"></span></div
          ></span>
        </div>
        <div class="form-box">
          <el-form
            :model="loginForm"
            label-position="top"
            @keyup.enter="onLogin"
          >
            <el-form-item label="用户名" prop="userName" inline-message>
              <el-input v-model="loginForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" inline-message>
              <el-input v-model="loginForm.password" show-password></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn" @click="onLogin">登录</div>
        <div class="reg">
          <router-link to="/register">
            没有账号？
            <span>点此注册！</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref } from "vue";
import { postLogin, getUserInfo } from "@/request/api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useMain } from "@/store/home";
export default defineComponent({
  setup() {
    //获取路由
    const router = useRouter();
    //pinia
    const store = useMain();
    //学生教师
    const isChange: Ref<boolean> = ref(false);
    const onChange = (type: boolean) => {
      isChange.value = type;
      type ? (loginForm.entity = 1) : (loginForm.entity = 0);
      console.log(loginForm);
    };
    //表单
    const loginForm = reactive({
      entity: 0,
      userName: "",
      password: "",
    });
    //登录事件
    const baseApi: string = import.meta.env.VITE_BASE_API;
    const onLogin = async () => {
      postLogin(loginForm).then((res) => {
        const od = res.data;
        if (od.code !== 500) {
          //判断是否教师
          if (loginForm.entity === 0) {
            store.isTeacher = false;
          } else {
            store.isTeacher = true;
          }
          localStorage.setItem("Authorization", od.data.Authorization);
          ElMessage.success("登录成功");

          getUserInfo().then((res) => {
            const loaData = res.data.data;
            loaData.avatarPath = baseApi + loaData.avatarPath;
            const userInfo = res.data.data;
            store.userInfo = userInfo;
            router.push("/");
          });
        } else {
          ElMessage.error("账号或密码错误");
        }
      });
    };
    return {
      //学生教师
      isChange,
      onChange,
      //表单
      loginForm,
      // 登录事件
      onLogin,
    };
  },
});
</script>

<style lang="less">
.login {
  width: 100vw;
  height: 100vh;
  background-color: #313131;
  background-image: url("@/assets/img/login-bg.webp");
  background-size: cover;
  .content {
    height: 500px;
    width: 500px;
    background-color: #fefefe;
    border-radius: 15px;
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
        margin-top: 80px;
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
        margin: 77px auto;
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
