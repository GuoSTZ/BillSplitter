import instance from './index';

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
  const response = await instance.get<ApiResponse<Person[]>>(`/people`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

// 创建人员
export const createPerson = async (personData: CreatePersonDto): Promise<Person> => {
  const response = await instance.post<ApiResponse<Person>>(`/people`, personData);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

// 更新人员
export const updatePerson = async (id: number, personData: UpdatePersonDto): Promise<Person> => {
  const response = await instance.patch<ApiResponse<Person>>(`/people/${id}`, personData);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

// 删除人员
export const deletePerson = async (id: number): Promise<void> => {
  const response = await instance.delete<ApiResponse<null>>(`/people/${id}`);
  
  if (response.data.code !== 0) {
    throw new Error(response.data.message);
  }
};

// 获取单个人员
export const getPerson = async (id: number): Promise<Person> => {
  const response = await instance.get<ApiResponse<Person>>(`/people/${id}`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};