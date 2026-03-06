import axiosInstance from './axios';

export interface Supplier {
  supplier_id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SupplierFormData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const supplierService = {
  // Get all suppliers
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/suppliers');
      return response.data;
    } catch (error) {
      console.error('Get suppliers error:', error);
      throw error;
    }
  },

  // Get supplier by ID
  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get supplier error:', error);
      throw error;
    }
  },

  // Create supplier
  create: async (data: SupplierFormData) => {
    try {
      const response = await axiosInstance.post('/suppliers', data);
      return response.data;
    } catch (error) {
      console.error('Create supplier error:', error);
      throw error;
    }
  },

  // Update supplier
  update: async (id: number, data: Partial<SupplierFormData>) => {
    try {
      const response = await axiosInstance.put(`/suppliers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update supplier error:', error);
      throw error;
    }
  },

  // Delete supplier
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete supplier error:', error);
      throw error;
    }
  }
};
