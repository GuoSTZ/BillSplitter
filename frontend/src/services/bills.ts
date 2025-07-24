import axios from 'axios';
// 移除 getAuthHeaders 导入

const API_BASE_URL = 'http://localhost:3000/api';

export interface BillParticipant {
  id?: number;
  personId: number;
  shareRatio: number;
  shareAmount?: number;
  isPaid?: boolean;
  person?: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface Bill {
  id: number;
  title: string;
  description?: string;
  totalAmount: number;
  status: 'pending' | 'settled' | 'cancelled';
  payerId: number;
  payer?: {
    id: number;
    username: string;
    name?: string;
  };
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
  const response = await axios.post<ApiResponse<Bill>>(`${API_BASE_URL}/bills`, billData);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const getAllBills = async (): Promise<Bill[]> => {
  const response = await axios.get<ApiResponse<Bill[]>>(`${API_BASE_URL}/bills`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const getBill = async (id: number): Promise<Bill> => {
  const response = await axios.get<ApiResponse<Bill>>(`${API_BASE_URL}/bills/${id}`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const updateBill = async (id: number, billData: Partial<CreateBillData>): Promise<Bill> => {
  const response = await axios.patch<ApiResponse<Bill>>(`${API_BASE_URL}/bills/${id}`, billData);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const deleteBill = async (id: number): Promise<void> => {
  const response = await axios.delete<ApiResponse<null>>(`${API_BASE_URL}/bills/${id}`);
  
  if (response.data.code !== 0) {
    throw new Error(response.data.message);
  }
};

export const updateParticipantPayment = async (
  billId: number,
  participantId: number,
  isPaid: boolean
): Promise<BillParticipant> => {
  const response = await axios.patch<ApiResponse<BillParticipant>>(
    `${API_BASE_URL}/bills/${billId}/participants/${participantId}/payment`,
    { isPaid }
  );
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};

export const getBillStatistics = async (): Promise<any> => {
  const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/bills/statistics`);
  
  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.message);
  }
};