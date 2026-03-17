import axiosInstance from './axios';
import { SalesReport, InventoryReport, FinancialReport, ExpiryReport } from '../../types/report.types';

export const reportService = {
  // Sales Reports
  getSalesReport: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly', startDate?: string, endDate?: string) => {
    try {
      const params: any = { period };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await axiosInstance.get('/dashboard/sales-report', { params });
      return response.data;
    } catch (error) {
      console.error('Get sales report error:', error);
      throw error;
    }
  },

  // Get top selling products
  getTopProducts: async (limit: number = 10, days: number = 30) => {
    try {
      // This would need a backend endpoint
      // For now, using dashboard summary
      const response = await axiosInstance.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Get top products error:', error);
      throw error;
    }
  },

  // Inventory Reports
  getInventoryReport: async (): Promise<{ success: boolean; data?: InventoryReport }> => {
    try {
      const response = await axiosInstance.get('/dashboard/inventory-insights');
      return response.data;
    } catch (error) {
      console.error('Get inventory report error:', error);
      throw error;
    }
  },

  // Financial Reports
  getFinancialReport: async (period: 'monthly' | 'quarterly' | 'yearly' = 'monthly', startDate?: string, endDate?: string) => {
    try {
      const params: any = { period };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await axiosInstance.get('/dashboard/financial', { params });
      return response.data;
    } catch (error) {
      console.error('Get financial report error:', error);
      throw error;
    }
  },

  // Expiry Reports
  getExpiryReport: async (days: number = 90): Promise<{ success: boolean; data?: ExpiryReport }> => {
    try {
      const response = await axiosInstance.get('/batches/expiring', { params: { days } });
      return response.data;
    } catch (error) {
      console.error('Get expiry report error:', error);
      throw error;
    }
  },

  // Wastage Report
  getWastageReport: async (startDate?: string, endDate?: string) => {
    try {
      const params: any = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await axiosInstance.get('/wastage', { params });
      return response.data;
    } catch (error) {
      console.error('Get wastage report error:', error);
      throw error;
    }
  },

  // Export to CSV/Excel
  exportToCSV: (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
