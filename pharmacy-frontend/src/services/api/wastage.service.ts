import axiosInstance from './axios';

export interface Wastage {
  wastage_id: number;
  batch_id: number;
  medicine_id: number;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  cost_price: number;
  total_loss: number;
  reason: 'EXPIRED' | 'DAMAGED' | 'SPILLED' | 'BROKEN' | 'THEFT' | 'OTHER';
  notes: string;
  reported_by: number;
  reported_date: string;
}

export interface WastageFormData {
  batch_id: number;
  quantity: number;
  reason: 'EXPIRED' | 'DAMAGED' | 'SPILLED' | 'BROKEN' | 'THEFT' | 'OTHER';
  notes?: string;
}

export const wastageService = {
  // Get all wastage reports
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/wastage');
      return response.data;
    } catch (error) {
      console.error('Get wastage error:', error);
      throw error;
    }
  },

  // Report wastage
  create: async (data: WastageFormData) => {
    try {
      const response = await axiosInstance.post('/wastage', data);
      return response.data;
    } catch (error) {
      console.error('Create wastage error:', error);
      throw error;
    }
  },

  // Get wastage by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    try {
      const response = await axiosInstance.get('/wastage', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Get wastage by date error:', error);
      throw error;
    }
  }
};
