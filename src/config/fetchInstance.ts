import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: import.meta.env.VITE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => response,
  (error) => {
    console.error('Response Error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          // 可根据需求触发全局状态更新或跳转
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(`请求错误: ${error.response.status}`);
      }
    } else if (error.request) {
      message.error('网络连接异常，请检查网络');
    } else {
      message.error(`请求失败: ${error.message}`);
    }
    return Promise.reject(error);
  },
);

export default instance;
