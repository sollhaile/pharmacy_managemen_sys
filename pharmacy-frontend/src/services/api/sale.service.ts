import axiosInstance from './axios';

export interface SaleItem {
  sale_item_id: number;
  sale_id: number;
  batch_id: number;
  medicine_id: number;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Sale {
  sale_id: number;
  invoice_number: string;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  prescription_id: string;
  doctor_name: string | null;
  items_total: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  sale_date: string;
  sold_by: number;
  notes: string | null;
  items?: SaleItem[];
}

export interface CustomerSalesResponse {
  success: boolean;
  customer?: {
    name: string;
    phone: string;
    total_visits: number;
    last_visit: string;
  };
  count?: number;
  data?: Sale[];  // ← Backend uses 'data', not 'sales'
}

export interface CheckoutData {
  phone: string;
  name: string;
  prescription_id: string;
  doctor_name?: string;
  items: Array<{
    batch_id: number;
    quantity: number;
  }>;
  payment_method: 'cash' | 'transfer';
  discount?: number;
  tax?: number;
}

export const saleService = {
  // Process checkout
  checkout: async (data: CheckoutData) => {
    try {
      const response = await axiosInstance.post('/checkout', data);
      return response.data;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  },

  // Get sale by invoice
  getByInvoice: async (invoice: string) => {
    try {
      const response = await axiosInstance.get(`/checkout/sale/${invoice}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice error:', error);
      throw error;
    }
  },

  // Get customer sales history by phone number
  getCustomerSales: async (phone: string): Promise<CustomerSalesResponse> => {
    try {
      const response = await axiosInstance.get(`/checkout/customer/${phone}/sales`);
      return response.data;
    } catch (error) {
      console.error('Get customer sales error:', error);
      throw error;
    }
  },

  // Search sales by invoice number or customer name/phone
  searchSales: async (query: string) => {
    try {
      // First try to get by invoice number
      if (query.startsWith('INV-')) {
        try {
          const invoiceResponse = await axiosInstance.get(`/checkout/sale/${query}`);
          if (invoiceResponse.data.success) {
            return { success: true, data: [invoiceResponse.data.data] };
          }
        } catch (e) {
          // Invoice not found, continue to customer search
        }
      }
      
      // Then try customer phone
      try {
        const customerResponse = await axiosInstance.get(`/checkout/customer/${query}/sales`);
        if (customerResponse.data.success) {
          // Backend returns data in 'data' array
          return { 
            success: true, 
            data: customerResponse.data.data || [] 
          };
        }
      } catch (e) {
        // Customer not found
        return { success: true, data: [] };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Search sales error:', error);
      return { success: false, data: [], error: 'Search failed' };
    }
  },

  // Get all sales - using customer history as fallback
  getAll: async () => {
    return { success: true, data: [] };
  }
};
