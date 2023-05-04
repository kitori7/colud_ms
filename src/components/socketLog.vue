<template>
  <el-dialog
    v-model="isOpen"
    title="日志"
    destroy-on-close
    @open="dialogOpen"
    width="80%"
  >
    <div class="log"><div id="terminalLog" ref="terminalLog"></div></div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
export default defineComponent({
  props: {
    podId: {
      type: Number,
      required: true,
    },
    pjtId: {
      type: Number,
      required: true,
    },
  },
  setup({ podId, pjtId }) {
    const isOpen = ref(false);
    const onOpen = () => {
      isOpen.value = true;
    };
    //对话框打开
    const terminalLog = ref();
    const dialogOpen = () => {
      initWebsocket();
      // 挂载
      initXterm();
    };
    //websocket
    let baseSocket: string = import.meta.env.VITE_SOCKET_BASE_API;
    const host = window.location.host;
    let websockObjLog: any = undefined;
    const token = localStorage.getItem("Authorization");
    const initWebsocket = () => {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持WebSocket");
      } else {
        const wsurl = `ws://${host}${baseSocket}/cloudms/socket/podLog?Authorization=${token}&pjtId=${pjtId}&podId=${podId}`;
        // 实例化 WebSocket
        const websock: WebSocket = new WebSocket(wsurl);
        // 监听 WebSocket 连接
        websock.onopen = websocketOnopen;
        // 监听 WebSocket 错误信息
        websock.onerror = websocketOnerror;
        // 监听 WebSocket 消息
        websock.onmessage = websocketOnmessage;
        // 监听 webSocket 断开信息
        websock.onclose = websocketOnclose;
        websockObjLog = websock;
      }
    };
    const websocketOnopen = () => {
      console.log("链接成功");
    };
    const websocketOnerror = (res: any) => {
      termObjLog.value.writeln(`\x1B[1;31m发生错误，请重试\x1B[1;31m`);
    };
    const websocketOnmessage = (res: any) => {
      console.log(res);
    };
    const websocketOnclose = (res: any) => {
      termObjLog.value.prompt();
      termObjLog.value.writeln(`\x1B[1;31m实例已结束\x1B[1;31m`);
    };
    const termObjLog = ref(); //保存实例
    const initXterm = () => {
      let term = new Terminal({
        //渲染类型
        rows: 20,
        cols: 24,
        convertEol: true, //启用时，光标将设置为下一行的开头 //终端中的回滚量
        disableStdin: false, //是否应禁用输入
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        letterSpacing: 2,
        fontSize: 18,
        theme: {
          foreground: "#ECECEC", //字体
          background: "#181d28", //背景色
          cursor: "help", //设置光标
        },
      });

      //绑定Terminal与websock
      let attachAddon = new AttachAddon(websockObjLog);
      term.loadAddon(attachAddon);

      term.open(terminalLog.value as HTMLElement);
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddon.fit();

      //聚焦进终端
      term.focus();

      // 窗口大小改变时，触发xterm的resize方法使自适应
      window.onresize = function () {
        fitAddon.fit();
      };

      termObjLog.value = term;
      runFakeTerminal();
    };
    const runFakeTerminal = () => {
      let term = termObjLog.value;
      //定义换行
      term.prompt = () => {
        term.write("\r\n$ ");
      };
      if (term._initialized) return;
      // 初始化
      term._initialized = true;
    };
    return {
      isOpen,
      onOpen,
      dialogOpen,
      terminalLog,
    };
  },
});
</script>

<style lang="less">
.log {
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
  #terminalLog {
    height: 100%;
    padding: 5px;
    background-color: #181d28;
    .xterm-viewport {
      &::-webkit-scrollbar {
        width: 7px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgb(152, 152, 152);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px #fff;
        border-radius: 10px;
        background: #0e1117;
      }
    }
  }
}
</style>