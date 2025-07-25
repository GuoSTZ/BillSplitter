import axios from "axios";

export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://localhost:5200/billApi'
  : '/billApi';

const instance = axios.create({
  baseURL: API_URL,
});

// 设置 axios 拦截器，自动添加 token 到请求头
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;