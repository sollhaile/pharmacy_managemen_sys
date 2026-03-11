import axiosInstance from './axios';
import { Supplier, SupplierDetails, SupplierFormData, PurchaseOrderData } from '../../types/supplier.types';

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

  // Get supplier details with batches
  getSupplierDetails: async (id: number): Promise<{ success: boolean; data?: SupplierDetails }> => {
    try {
      // Get supplier info
      const supplierRes = await axiosInstance.get(`/suppliers/${id}`);
      
      // Get batches from this supplier
      const batchesRes = await axiosInstance.get('/batches', {
        params: { supplier_id: id }
      });
      
      if (supplierRes.data.success) {
        const batches = batchesRes.data.data || [];
        
        // Calculate stats
        const total_units = batches.reduce((sum: number, b: any) => sum + b.quantity, 0);
        const total_value = batches.reduce((sum: number, b: any) => 
          sum + (b.quantity * Number(b.cost_price || 0)), 0
        );
        
        const supplierDetails: SupplierDetails = {
          ...supplierRes.data.data,
          batches,
          total_batches: batches.length,
          total_units,
          total_value
        };
        
        return { success: true, data: supplierDetails };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Get supplier details error:', error);
      return { success: false };
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

  // Delete supplier (soft delete)
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete supplier error:', error);
      throw error;
    }
  },

  // Create purchase order (sends Telegram)
  createPurchaseOrder: async (data: PurchaseOrderData) => {
    try {
      const response = await axiosInstance.post('/supplier-orders', data);
      return response.data;
    } catch (error) {
      console.error('Create purchase order error:', error);
      throw error;
    }
  }
};
