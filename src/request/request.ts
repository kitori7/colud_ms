import axios from "axios";
// 创建axios实例

const request = axios.create({
  // 所有的请求地址前缀部分
  timeout: 301000, // 请求超时时间(毫秒)
  // withCredentials: true, // 异步请求携带cookie
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// request拦截器
request.interceptors.request.use(
  (config) => {
    // 如果你要去localStor获取token
    let token = localStorage.getItem("Authorization");
    if (token) {
      config.headers.Authorization = token;
    }
    //推请求进队列
    // config["cancelToken"] = new axios.CancelToken(function executor(cancel) {
    // });
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    Promise.reject(error);
  }
);

// response 拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    if (response.data.Token) {
      localStorage.setItem("x-auth-token", response.data.Token);
    }
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
export default request;
