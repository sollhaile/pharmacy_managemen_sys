import axiosInstance from './axios';

export interface DashboardSummary {
  sales: {
    today: number;
    week: number;
    month: number;
    year: number;
  };
  profit: {
    today: number;
    month: number;
  };
  counts: {
    customers: number;
    medicines: number;
    low_stock: number;
    expiring_soon: number;
  };
  top_selling: Array<{
    medicine_id: number;
    medicine_name: string;
    total_quantity: number;
    total_revenue: number;
    current_stock?: number;
  }>;
  sales_chart: Array<{
    date: string;
    total: number;
  }>;
}

export interface InventoryInsights {
  stock_value: {
    cost: number;
    retail: number;
    potential_profit: number;
  };
  expiring_soon: {
    count: number;
    batches: Array<{
      batch_number: string;
      medicine: string;
      expiry_date: string;
      days_left: number;
      quantity: number;
      value: number;
    }>;
  };
  out_of_stock: Array<{
    medicine_id: number;
    name: string;
  }>;
  category_breakdown: Array<{
    category: string;
    value: number;
  }>;
}

export const dashboardService = {
  // Get dashboard summary
  getSummary: async (): Promise<{ success: boolean; data?: DashboardSummary }> => {
    try {
      const response = await axiosInstance.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
      throw error;
    }
  },

  // Get inventory insights
  getInventoryInsights: async (): Promise<{ success: boolean; data?: InventoryInsights }> => {
    try {
      const response = await axiosInstance.get('/dashboard/inventory-insights');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inventory insights:', error);
      throw error;
    }
  },

  // Get customer insights
  getCustomerInsights: async (): Promise<{ success: boolean; data?: any }> => {
    try {
      const response = await axiosInstance.get('/dashboard/customer-insights');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer insights:', error);
      throw error;
    }
  },

  // Get financial dashboard
  getFinancial: async (): Promise<{ success: boolean; data?: any }> => {
    try {
      const response = await axiosInstance.get('/dashboard/financial');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch financial dashboard:', error);
      throw error;
    }
  },

  // Get sales report
  getSalesReport: async (period: string = 'month'): Promise<{ success: boolean; data?: any }> => {
    try {
      const response = await axiosInstance.get('/dashboard/sales-report', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
      throw error;
    }
  },

  // Get inventory valuation
  getInventoryValuation: async (): Promise<{ success: boolean; data?: any }> => {
    try {
      const response = await axiosInstance.get('/dashboard/inventory-valuation');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inventory valuation:', error);
      throw error;
    }
  },

  // Get cash flow
  getCashFlow: async (): Promise<{ success: boolean; data?: any }> => {
    try {
      const response = await axiosInstance.get('/dashboard/cashflow');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cash flow:', error);
      throw error;
    }
  }
};
