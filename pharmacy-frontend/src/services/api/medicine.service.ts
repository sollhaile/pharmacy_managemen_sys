import axiosInstance from './axios';

export interface Batch {
  batch_id: number;
  batch_number: string;
  medicine_id: number;
  expiry_date: string;
  manufacturing_date: string | null;
  supplier_id: number | null;
  quantity: number;
  cost_price: number | null;
  selling_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  days_until_expiry?: number;
  expiry_status?: 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'OK';
}

export interface Medicine {
  medicine_id: number;
  name: string;
  generic_name: string | null;
  brand: string | null;
  category: string | null;
  form: string | null;
  strength: string | null;
  unit: string | null;
  barcode: string | null;
  reorder_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_stock?: number;
  is_low_stock?: boolean;
  batches?: Batch[];
}

export interface MedicineFormData {
  name: string;
  generic_name?: string;
  brand?: string;
  category?: string;
  form?: string;
  strength?: string;
  unit?: string;
  barcode?: string;
  reorder_level: number;
}

export interface BatchFormData {
  batch_number: string;
  medicine_id: number;
  expiry_date: string;
  manufacturing_date?: string;
  supplier_id?: number;
  quantity: number;
  cost_price?: number;
  selling_price?: number;
}

export const medicineService = {
  // Get all medicines
  getAll: async (params?: { search?: string; category?: string }) => {
    try {
      const response = await axiosInstance.get('/medicines', { params });
      return response.data;
    } catch (error) {
      console.error('Get medicines error:', error);
      throw error;
    }
  },

  // Get single medicine with batches
  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get medicine error:', error);
      throw error;
    }
  },

  // Create medicine
  create: async (data: MedicineFormData) => {
    try {
      const response = await axiosInstance.post('/medicines', data);
      return response.data;
    } catch (error) {
      console.error('Create medicine error:', error);
      throw error;
    }
  },

  // Update medicine
  update: async (id: number, data: Partial<MedicineFormData>) => {
    try {
      const response = await axiosInstance.put(`/medicines/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update medicine error:', error);
      throw error;
    }
  },

  // Delete medicine
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete medicine error:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await axiosInstance.get('/medicines/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // Get low stock
  getLowStock: async () => {
    try {
      const response = await axiosInstance.get('/medicines/low-stock');
      return response.data;
    } catch (error) {
      console.error('Get low stock error:', error);
      throw error;
    }
  },

  // Get batches for medicine
  getBatches: async (medicineId: number) => {
    try {
      const response = await axiosInstance.get(`/medicines/${medicineId}/batches`);
      return response.data;
    } catch (error) {
      console.error('Get batches error:', error);
      return { success: false, data: { batches: [] } };
    }
  },

  // Add batch to medicine
  addBatch: async (medicineId: number, data: BatchFormData) => {
    try {
      const response = await axiosInstance.post('/batches', {
        ...data,
        medicine_id: medicineId
      });
      return response.data;
    } catch (error) {
      console.error('Add batch error:', error);
      throw error;
    }
  }
};
