<template>
  <div class="text-content">
    <div class="cart"><div id="terminal" ref="terminal"></div></div>
    <div class="info-content">
      <resource :pod-id="podId" :pjt-id="pjtId"></resource>
      <div class="info">
        <el-descriptions
          title="实例信息"
          :column="2"
          direction="vertical"
          border
          size="small"
        >
          <template #extra>
            <el-button type="info" @click="onLog">日志</el-button>
          </template>
          <el-descriptions-item>
            <template #label>
              <div>镜像名称</div>
            </template>
            {{ stuPodInfo.image }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>状态</div>
            </template>
            <el-tag :type="status ? 'success' : 'danger'">{{
              status ? "运行中" : "禁用"
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>CPU下限</div>
            </template>
            <div>{{ stuPodInfo.requestsCpu }}</div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>CPU上限</div>
            </template>
            <div>{{ stuPodInfo.limitsCpu }}</div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>内存下限</div>
            </template>
            <div>{{ stuPodInfo.requestsMemory }}</div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>内存上限</div>
            </template>
            <div>{{ stuPodInfo.limitsMemory }}</div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>开始时间</div>
            </template>
            <div>{{ stuPodInfo.startTime.slice(5, -3) }}</div>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>剩余时间</div>
            </template>
            {{ status ? showDate : "已结束" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div>环境变量</div>
            </template>
            <span> {{ stuPodInfo.environment === "{}" ? "暂无" : "" }}</span>
            <el-empty
              description="暂无内容"
              v-if="JSON.stringify(envObj) == '{}' || envObj === null"
            />
            <el-descriptions :column="1" border v-else>
              <el-descriptions-item
                :label="key"
                v-for="(value, key) in envObj"
                :key="key"
                >{{ value }}</el-descriptions-item
              >
            </el-descriptions>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <socketLog :pod-id="podId" :pjt-id="pjtId" ref="socketRef"></socketLog>
  </div>
</template>

<script lang="ts">
import "xterm/css/xterm.css";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  Ref,
} from "@vue/runtime-core";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import { useRoute } from "vue-router";
import { useMain } from "@/store/home";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getPodInfo } from "@/request/api";
import resource from "@/components/resource.vue";
import socketLog from "@/components/socketLog.vue";
interface IStuPodInfo {
  podId: number;
  pjtId: number;
  image: string;
  environment: string;
  limitsCpu: number;
  requestsCpu: number;
  limitsMemory: number;
  requestsMemory: number;
  startTime: string;
  endTime: string;
  status: number;
}
export default defineComponent({
  components: { resource, socketLog },
  setup() {
    dayjs.extend(relativeTime);
    // websocket
    const route = useRoute();
    const store = useMain();

    // 实例详细信息
    const stuPodInfo: Ref<IStuPodInfo> = ref({
      podId: 0,
      pjtId: 0,
      image: "",
      environment: "",
      limitsCpu: 0,
      requestsCpu: 0,
      limitsMemory: 0,
      requestsMemory: 0,
      startTime: "",
      endTime: "",
      status: 0,
    });
    onMounted(() => {
      getPodInfo(podId).then((res) => {
        stuPodInfo.value = res.data.data;
        envObj.value = JSON.parse(stuPodInfo.value.environment);
        timer.value = dayjs(stuPodInfo.value.endTime);
      });
    });
    //时间差
    let timer: Ref<any> = ref(0);
    const time = setInterval(() => {
      timer.value += 1;
    }, 1000);
    const showDate = computed(() => {
      const now = dayjs();
      const diff = dayjs(timer.value).diff(now, "second");
      if (diff < 0) {
        return "倒计时已结束";
      }

      const minutes = Math.floor(diff / 60);
      let seconds = diff % 60;
      if (minutes == 0 && seconds == 0) {
        websocketOnclose();
      }

      if (seconds < 10) {
        seconds = ("0" + seconds) as unknown as number;
      }

      return `${minutes}分${seconds}秒`;
    });
    //展示环境变量
    const envObj = ref({});
    //实例状态
    const status = ref(true);
    //pjt pod
    const pjtId = Number(route.params.pjtId);
    const podId = Number(route.params.podId);
    let baseSocket: string = import.meta.env.VITE_SOCKET_BASE_API;
    const host = window.location.host;
    let websockObj: any = undefined;
    const token = localStorage.getItem("Authorization");
    const initWebsocket = () => {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持WebSocket");
      } else {
        const wsurl = `ws://${host}${baseSocket}/cloudms/socket/podSSH?Authorization=${token}&pjtId=${pjtId}&podId=${podId}`;
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
        websockObj = websock;
      }
    };
    const websocketOnopen = () => {
      console.log("链接成功");
    };
    const websocketOnerror = (res: any) => {
      termObj.value.writeln(`\x1B[1;31m发生错误，请重试\x1B[1;31m`);
    };
    const websocketOnmessage = (res: any) => {};
    const websocketOnclose = () => {
      termObj.value.prompt();
      status.value = false;
      termObj.value.writeln(`\x1B[1;31m实例已结束\x1B[1;31m`);
    };
    onMounted(() => {
      initWebsocket();
      // 挂载
      initXterm();
    });
    const termObj = ref(); //保存实例
    const initXterm = () => {
      let term = new Terminal({
        //渲染类型
        rows: 100,
        convertEol: true, //启用时，光标将设置为下一行的开头 //终端中的回滚量
        disableStdin: false, //是否应禁用输入
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        letterSpacing: 2,
        fontSize: 23,
        theme: {
          foreground: "#ECECEC", //字体
          background: "#181d28", //背景色
          cursor: "help", //设置光标
        },
      });

      //绑定Terminal与websock
      var attachAddon = new AttachAddon(websockObj);
      term.loadAddon(attachAddon);

      term.open(document.getElementById("terminal") as HTMLElement);
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddon.fit();

      //聚焦进终端
      term.focus();

      // 窗口大小改变时，触发xterm的resize方法使自适应
      window.onresize = function () {
        fitAddon.fit();
      };

      termObj.value = term;
      runFakeTerminal();
    };
    const runFakeTerminal = () => {
      let term = termObj.value;
      //定义换行
      term.prompt = () => {
        term.write("\r\n$ ");
      };
      if (term._initialized) return;
      // 初始化
      term._initialized = true;
      term.writeln(
        `云易学平台欢迎您 \x1b[1;32m${store.userInfo.nickName}\x1b[0m.`
      );
      term.writeln(
        "终端默认使用\x1b[1;32msh\x1b[0m，若需要使用\x1b[1;32mbash\x1b[0m，可使用\x1b[1;32m`# bash`\x1b[0m命令自行切换"
      );
    };
    //日志
    const socketRef = ref();
    const onLog = () => {
      socketRef.value.onOpen();
    };
    return {
      initWebsocket,
      stuPodInfo,
      showDate,
      envObj,
      status,
      pjtId,
      podId,
      socketRef,
      onLog,
    };
  },
});
</script>

<style lang="less">
.text-content {
  box-sizing: border-box;
  display: flex;
  height: 100vh;
  .cart {
    border: 5px solid #333;
    margin: 20px;
    border-radius: 8px;
    width: 70%;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    #terminal {
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
  .info-content {
    display: flex;
    flex-direction: column;
    width: 25%;
    .info {
      flex: 1;
      font-size: 25px;
      border: 5px solid #333;
      border-radius: 8px;
      overflow: auto;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
        rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
      margin: 20px;
      background-color: #fff;
      .el-descriptions {
        margin: 0;
        box-shadow: none;
      }
    }
  }
}
</style>
