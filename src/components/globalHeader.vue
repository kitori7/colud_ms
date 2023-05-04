<template>
  <el-container>
    <el-header>
      <div class="global-header">
        <div class="w">
          <router-link to="/index" class="school-name"
            ><img src="@/assets/img/logo.png" alt=""
          /></router-link>
          <div class="user-box">
            <span class="active">
              <img :src="userInfo.avatarPath" alt="" />
            </span>
            <el-dropdown>
              <div>
                <span class="username">{{ userInfo.nickName }}</span>
                <el-icon color="#04f2ff" class="icon" size="20px"
                  ><ArrowDown
                /></el-icon>
                <div style="font-weight: 700">{{ userInfo.schoolName }}</div>
              </div>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="onUserInfo"
                    >用户信息</el-dropdown-item
                  >
                </el-dropdown-menu>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-header>
  </el-container>
  <userInfo ref="userInfoRef"></userInfo>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { getLogout } from "@/request/api";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useMain, IUserInfo } from "@/store/home";
import userInfo from "@/components/userInfo.vue";
export default defineComponent({
  name: "globalHeader",
  components: {
    ArrowDown,
    userInfo,
  },
  setup() {
    //路由
    const router = useRouter();
    //pinia
    const store = useMain();
    const { userInfo } = store;
    //登出
    const logout = async () => {
      getLogout().then((res) => {
        if (res.data.code === 200) {
          localStorage.removeItem("x-auth-token");
          ElMessage.success(res.data.msg);
          store.userInfo = {};
          router.push("/login");
        }
      });
    };
    //用户信息
    const userInfoRef = ref();
    const onUserInfo = () => {
      userInfoRef.value.onOpen();
    };

    return {
      //登出
      logout,
      userInfo,
      onUserInfo,
      userInfoRef,
    };
  },
});
</script>

<style lang="less">
.el-header {
  padding: 0 !important;
}
.global-header {
  width: 100%;
  height: 45px;
  background-color: #313131;
  .w {
    padding: 0 150px;
    img {
      transform: translate(0, 8px);
      // width: 60px;
      object-fit: cover;
      height: 35px;
    }
    position: relative;
    .school-name {
      line-height: 45px;
      font-size: 18px;
      color: #fff;
    }
    .user-box {
      position: absolute;
      display: flex;
      justify-content: space-between;
      right: 110px;
      top: 15px;
      width: 140px;
      .active {
        display: inline-block;
        width: 55px;
        height: 55px;
        border-radius: 100%;
        position: relative;
        // overflow: hidden;
        &::after {
          content: "";
          position: absolute;
          left: -2px;
          width: 60px;
          height: 60px;
          background-color: #04f2ff;
          border-radius: 100%;
          z-index: -1;
        }
        img {
          position: absolute;
          top: -7px;
          width: 100%;
          height: 100%;
          border-radius: 100%;
          object-fit: cover;
        }
      }
      .username {
        line-height: 35px;
        color: #fff;
        padding: 10px;
        cursor: pointer;
      }
      .icon {
        transform: translate(0, 5px);
        cursor: pointer;
        transition: all 0.5s;
        &:hover {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
