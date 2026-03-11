import axiosInstance from './axios';
import { Customer, CustomerDetails, CustomerSale } from '../../types/customer.types';

export const customerService = {
  // Get all customers
  getAll: async (search?: string) => {
    try {
      const response = await axiosInstance.get('/customers', { 
        params: { search } 
      });
      return response.data;
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  },

  // Get customer by phone
  getByPhone: async (phone: string) => {
    try {
      const response = await axiosInstance.get(`/checkout/customer/${phone}/sales`);
      return response.data;
    } catch (error) {
      console.error('Get customer error:', error);
      throw error;
    }
  },

  // Get customer details with sales
  getCustomerDetails: async (phone: string): Promise<{ success: boolean; data?: CustomerDetails }> => {
    try {
      const response = await axiosInstance.get(`/checkout/customer/${phone}/sales`);
      
      if (response.data.success) {
        const customerData = response.data.customer;
        const sales = response.data.data || [];
        
        // Calculate additional stats
        const total_spent = sales.reduce((sum: number, sale: any) => 
          sum + Number(sale.total_amount), 0
        );
        
        // Find most purchased category
        const categoryCount: Record<string, number> = {};
        sales.forEach((sale: any) => {
          sale.items?.forEach((item: any) => {
            // This would need medicine category data
            // For now, we'll skip
          });
        });
        
        const customerDetails: CustomerDetails = {
          ...customerData,
          sales,
          total_spent,
          average_purchase: sales.length > 0 ? total_spent / sales.length : 0,
          favorite_category: null
        };
        
        return { success: true, data: customerDetails };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Get customer details error:', error);
      return { success: false };
    }
  },

  // Create customer (usually done via checkout)
  create: async (data: { name: string; phone: string; address?: string }) => {
    try {
      // This would be a POST to /customers if you have that endpoint
      // For now, customers are created during checkout
      const checkoutData = {
        ...data,
        prescription_id: 'REGISTRATION',
        items: [],
        payment_method: 'cash'
      };
      const response = await axiosInstance.post('/checkout', checkoutData);
      return response.data;
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  },

  // Update customer
  update: async (phone: string, data: Partial<Customer>) => {
    try {
      const response = await axiosInstance.put(`/customers/${phone}`, data);
      return response.data;
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  }
};
