import axiosInstance from './axios';

export interface Wastage {
  wastage_id: number;
  batch_id: number;  // Required (NOT NULL in schema)
  medicine_id: number;
  medicine_name: string;
  batch_number: string;  // Required (NOT NULL in schema)
  quantity: number;
  cost_price: number;
  total_loss: number;
  reason: 'EXPIRED' | 'DAMAGED' | 'SPILLED' | 'BROKEN' | 'THEFT' | 'OTHER';  // Match your enum
  notes?: string;
  reported_by: number;
  reported_date: string;
}

export interface WastageFormData {
  batch_id: number;  // Required
  medicine_id: number;
  medicine_name: string;
  batch_number: string;  // Required
  quantity: number;
  cost_price: number;
  reason: 'EXPIRED' | 'DAMAGED' | 'SPILLED' | 'BROKEN' | 'THEFT' | 'OTHER';
  notes?: string;
}

export interface WastageSummary {
  total_reports: number;
  total_loss: number;
  by_reason: {
    EXPIRED: number;
    DAMAGED: number;
    SPILLED: number;
    BROKEN: number;
    THEFT: number;
    OTHER: number;
  };
  by_month: Array<{
    month: string;
    loss: number;
    count: number;
  }>;
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

  // Get wastage summary
  getSummary: async (): Promise<{ success: boolean; data?: WastageSummary }> => {
    try {
      const response = await axiosInstance.get('/wastage/summary');
      return response.data;
    } catch (error) {
      console.error('Get wastage summary error:', error);
      return { success: false };
    }
  },

  // Report wastage (manual entry)
  create: async (data: WastageFormData) => {
    try {
      const response = await axiosInstance.post('/wastage', data);
      return response.data;
    } catch (error) {
      console.error('Create wastage error:', error);
      throw error;
    }
  },

  // Auto-detect and report expired batches
  autoDetectExpired: async () => {
    try {
      const response = await axiosInstance.post('/wastage/auto-detect');
      return response.data;
    } catch (error) {
      console.error('Auto-detect expired error:', error);
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
  },

  // Get wastage by reason
  getByReason: async (reason: string) => {
    try {
      const response = await axiosInstance.get('/wastage', {
        params: { reason }
      });
      return response.data;
    } catch (error) {
      console.error('Get wastage by reason error:', error);
      throw error;
    }
  },

  // Delete wastage record (admin only)
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/wastage/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete wastage error:', error);
      throw error;
    }
  }
};
