import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface Person {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonDto {
  name: string;
  phone?: string;
  email?: string;
  note?: string;
}

export interface UpdatePersonDto {
  name?: string;
  phone?: string;
  email?: string;
  note?: string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 获取所有人员
export const getAllPeople = async (): Promise<Person[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<ApiResponse<Person[]>>(`${API_BASE_URL}/people`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

// 创建人员
export const createPerson = async (personData: CreatePersonDto): Promise<Person> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<ApiResponse<Person>>(`${API_BASE_URL}/people`, personData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

// 更新人员
export const updatePerson = async (id: number, personData: UpdatePersonDto): Promise<Person> => {
  const token = localStorage.getItem('token');
  const response = await axios.patch<ApiResponse<Person>>(`${API_BASE_URL}/people/${id}`, personData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

// 删除人员
export const deletePerson = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/people/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.data.code !== 0) {
    throw new Error(response.data.message);
  }
};

// 获取单个人员
export const getPerson = async (id: number): Promise<Person> => {
  const token = localStorage.getItem('token');
  const response = await axios.get<ApiResponse<Person>>(`${API_BASE_URL}/people/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};