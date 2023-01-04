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
          <el-form :model="loginForm" label-position="top">
            <el-form-item label="用户名" prop="username" inline-message>
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" inline-message>
              <el-input v-model="loginForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item
              label="验证码"
              prop="checkPass"
              inline-message
              class="check-pass"
            >
              <el-input v-model="loginForm.checkPass"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">登录</div>
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
export default defineComponent({
  name: "login",
  setup() {
    //学生教师
    const isChange: Ref<boolean> = ref(false);
    const onChange = (type: boolean) => {
      isChange.value = type;
    };
    //表单
    const loginForm = reactive({
      username: "",
      password: "",
      checkPass: "",
    });
    return {
      //学生教师
      isChange,
      onChange,
      //表单
      loginForm,
    };
  },
});
</script>
  
<style lang="less">
.login {
  width: 100vw;
  height: 100vh;
  .content {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    height: 500px;
    width: 500px;
    background-color: #fefefe;
    margin: 0 auto;
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
            border-right: 3px solid #337ecc;
          }
          &.active {
            color: #303030;
          }
        }
        .line-box {
          position: absolute;
          bottom: -20px;
          left: 49px;
          .line {
            display: inline-block;
            width: 25px;
            height: 1px;
            border-top: 2px solid #202020;
            margin: 6px;
          }
        }
      }
      .form-box {
        margin-top: 40px;
        .check-pass {
          width: 60%;
        }
      }
      .btn {
        cursor: pointer;
        width: 100%;
        height: 40px;
        background-color: #337ecc;
        color: #ecf5ff;
        text-align: center;
        line-height: 40px;
        font-size: 22px;
        border-radius: 15px;
        margin: 57px auto;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      }
      .reg {
        cursor: pointer;
        width: 100%;
        text-align: center;
        color: #337ecc;
        height: 34px;
        span {
          border-bottom: 1px solid #337ecc;
        }
      }
    }
  }
}
</style>