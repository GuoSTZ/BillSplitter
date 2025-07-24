import instance from './index';

export interface BillParticipant {
  id?: number;
  personId: number;
  shareRatio: number;
  shareAmount?: number;
}

export interface Bill {
  id: number;
  title: string;
  description?: string;
  billItems: {
    id: number;
    amount: number;
    payerId: number;
    participants: BillParticipant[];
  }[];
  participants: BillParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillData {
  title: string;
  description?: string;
  totalAmount: number;
  payerId: number;
  participants: {
    personId: number;
    shareRatio: number;
  }[];
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export const createBill = async (billData: CreateBillData): Promise<Bill> => {
  const response = await instance.post<ApiResponse<Bill>>(`/bills`, billData);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const getAllBills = async (): Promise<Bill[]> => {
  const response = await instance.get<ApiResponse<Bill[]>>(`/bills`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const getBill = async (id: number): Promise<Bill> => {
  const response = await instance.get<ApiResponse<Bill>>(`/bills/${id}`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const updateBill = async (id: number, billData: Partial<CreateBillData>): Promise<Bill> => {
  const response = await instance.patch<ApiResponse<Bill>>(`/bills/${id}`, billData);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const deleteBill = async (id: number): Promise<void> => {
  const response = await instance.delete<ApiResponse<null>>(`/bills/${id}`);
  
  if (response.data.code !== 0) {
    throw new Error(response.data.message);
  }
};

export const getBillStatistics = async (): Promise<any> => {
  const response = await instance.get<ApiResponse<any>>(`/bills/statistics`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};