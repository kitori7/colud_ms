<template>
  <div class="home">
    <globalHeader></globalHeader>
    <div class="global-w">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import globalHeader from "@/components/globalHeader.vue";
export default defineComponent({
  name: "Home",
  components: {
    globalHeader,
  },
  setup() {},
});
</script>

<style lang="less">
</style>
