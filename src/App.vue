<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  setup() {},
});
</script>
<style lang="less">
/* 初始化全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 重置浏览器默认样式 */
html,
body,
ul,
ol,
li,
p,
h1,
h2,
h3,
h4,
h5,
h6,
form,
fieldset,
legend,
input,
textarea,
button,
select,
table {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

/* 清除浏览器默认样式 */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

body {
  line-height: 1;
}

/* 设置默认字体 */
body {
  font-family: "微软雅黑", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* 设置默认字体大小 */
body {
  font-size: 14px;
  background-color: #e5e5e5;
}
router-link {
  text-decoration: none;
}
a {
  text-decoration: none;
}
</style>
