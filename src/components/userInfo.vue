<template>
  <el-dialog v-model="isDialog" title="用户信息" width="30%">
    <div class="user-info">
      <div class="avatar">
        <up-load
          action="/cloudms/user/updateAvatar"
          accept=".jpg,.jpeg,.png"
          :onOnSucceed="succeed"
          ><img
            class="userInfoImg"
            :src="userInfo.avatarPath"
            alt=""
            @click="onUpLoad"
        /></up-load>
      </div>
      <div class="item-content">
        <div class="item">
          <span>账号：</span>
          <span> {{ userInfo.userName }}</span>
        </div>
        <div class="item">
          <span>昵称：</span>
          <span> {{ userInfo.nickName }}</span>
        </div>
        <div class="item">
          <span>身份：</span>
          <span> {{ userInfo.entity == "0" ? "学生" : "老师" }}</span>
        </div>
        <div class="item">
          <span>学校：</span>
          <span> {{ userInfo.schoolName }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMain } from "@/store/home";
import upLoad from "./upLoad.vue";
export default defineComponent({
  components: {
    upLoad,
  },
  setup() {
    const store = useMain();
    const { userInfo } = store;
    const isDialog = ref(false);
    const onOpen = () => {
      isDialog.value = true;
    };
    const onUpLoad = () => {};
    const baseApi = import.meta.env.VITE_BASE_API;
    const succeed = (res: any) => {
      let av = res.data;
      av = baseApi + res.data;
      userInfo.avatarPath = av;
    };
    return {
      userInfo,
      isDialog,
      onOpen,
      onUpLoad,
      succeed,
    };
  },
});
</script>

<style lang="less">
.user-info {
  margin: 0 auto;
  width: 100%;
  text-align: center;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  .avatar {
    height: 150px;
    position: relative;
    transition: all 0.5s;

    .userInfoImg {
      height: 150px;
      width: 150px;
      border-radius: 100%;
    }
    &:hover:after {
      content: "修改头像";
      position: absolute;
      border-radius: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      height: 100%;
      color: #fff;
      pointer-events: none;
      line-height: 150px;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      width: 150px;
      z-index: 2;
    }
  }

  .item-content {
    margin: 15px auto;
    // background-color: #888;
    text-align: left;
    .item {
      padding: 10px;
      letter-spacing: 3px;
      span {
        &:first-child {
          font-weight: 700;
        }
      }
    }
  }
}
</style>