import axios from 'axios';
import instance from './index';

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
    const response = await instance.post<ApiResponse<{ access_token: string }>>(`/auth/login`, { username, password });
    
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

// 获取认证头
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// 获取用户信息
export const getUserInfo = async (): Promise<UserInfo> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('未找到认证token');
  }

  try {
    // 移除手动设置的 headers，拦截器会自动处理
    const response = await instance.get<ApiResponse<UserInfo>>(`/users/profile`);
    
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