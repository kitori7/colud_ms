import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
// 配置@别名
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  //项目根路径
  const root = process.cwd();
  // 通过vite提供的工具方法去加载相应环境的配置
  // 这里的mode其实就是我们 --mode prod的prod
  //const env = loadEnv(mode, process.cwd(), '')
  const {
    VITE_BASE_API,
    VITE_SERVER_PROXY_TARGET,
    VITE_SOCKET_BASE_API,
    VITE_SOCKET_SERVER_PROXY_TARGET,
  } = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      proxy: {
        // 带选项写法：http://localhost:5173/dev-api/bar -> http://119.91.239.111:30055/bar
        [VITE_BASE_API]: {
          target: VITE_SERVER_PROXY_TARGET,
          // changeOrigin: true,
          rewrite: (path) => path.replace(VITE_BASE_API, ""),
        },
        // 代理 websockets 或 socket.io 写法：ws://localhost:5173/dev-socket/cloudms -> ws://119.91.239.111:30055/cloudms
        [VITE_SOCKET_BASE_API]: {
          target: VITE_SOCKET_SERVER_PROXY_TARGET,
          ws: true,
          rewrite: (path) => path.replace(VITE_SOCKET_BASE_API, ""),
        },
      },
    },
    plugins: [vue()],
    build: {
      chunkSizeWarningLimit: 1500,
    },
    // ↓解析配置
    resolve: {
      // ↓路径别名
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  };
});
