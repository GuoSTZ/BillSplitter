import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 登录函数
export const login = async (username: string, password: string): Promise<void> => {
  try {
    const response = await axios.post<ApiResponse<{ access_token: string }>>(`${API_URL}/auth/login`, { username, password });
    
    if (response.data.code === 0) {
      const { access_token } = response.data.data;
      localStorage.setItem('token', access_token);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

// 登出函数
export const logout = (): void => {
  localStorage.removeItem('token');
};

// 检查是否已认证
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

// 获取用户信息
export const getUserInfo = async (): Promise<UserInfo> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('未找到认证token');
  }

  try {
    const response = await axios.get<ApiResponse<UserInfo>>(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.data.code === 0) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logout();
      throw new Error('认证已过期，请重新登录');
    }
    throw error;
  }
};

// 设置 axios 拦截器，自动添加 token 到请求头
axios.interceptors.request.use(
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

// 设置 axios 响应拦截器，处理 401 错误（未授权）
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除 token 并跳转到登录页
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);