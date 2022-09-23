import axios from "axios";
import router from "../router";
import { Message } from "link-ui-web";
// import { getSession } from "@/utils/session";

// const baseURL = document.location.protocol === 'https:'
//   ? 'https://mock.lianyirong.com.cn/mock/60d0724a35fb564461b52c08'
//   : 'http://172.16.87.172:7300/mock/60d0724a35fb564461b52c08'

const api = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000000,
  withCredentials: true,
});
// 请求拦截
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"),
      origin = sessionStorage.getItem("origin");
    config.url = (process.env.NODE_ENV == "development" ? '/beefeather' : decodeURIComponent(origin)) + config.url;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截
api.interceptors.response.use(
  (response) => {
    if (response.request.responseType === 'blob' || response.config.url.indexOf(".json") > -1) {
      return response
    }
    const code = response.data.code;
    if (code === 401) {
      Message.error({ message: "用户未登录！", offset: 72, });
      router.push("/login");
      return Promise.reject(new Error("用户未登录！"));
    } else {
      return response;
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
