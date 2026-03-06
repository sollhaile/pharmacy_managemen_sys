import axiosInstance from './axios';
import { ApiResponse } from '../../types/api.types';
import { Customer, CustomerFormData } from '../../types/customer.types';

export const customerService = {
  // Get all customers
  getAll: async (search?: string): Promise<ApiResponse<Customer[]>> => {
    const response = await axiosInstance.get('/checkout/customers', { params: { search } });
    return response.data;
  },

  // Get customer by phone
  getByPhone: async (phone: string): Promise<ApiResponse<Customer>> => {
    const response = await axiosInstance.get(`/checkout/customer/${phone}/sales`);
    return response.data;
  },

  // Create customer
  create: async (data: CustomerFormData): Promise<ApiResponse<Customer>> => {
    // Customers are auto-created during checkout
    // This is a helper for manual creation
    const checkoutData = {
      ...data,
      prescription_id: 'MANUAL-001',
      items: [],
      payment_method: 'cash',
    };
    const response = await axiosInstance.post('/checkout', checkoutData);
    return response.data;
  },
};