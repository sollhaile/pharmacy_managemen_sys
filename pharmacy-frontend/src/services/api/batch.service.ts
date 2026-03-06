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
  expiry_status?: 'GOOD' | 'WARNING' | 'CRITICAL' | 'EXPIRED';
  medicine?: {
    medicine_id: number;
    name: string;
    generic_name: string;
    category: string;
  };
  batch_medicine?: {
    medicine_id: number;
    name: string;
    generic_name: string;
    category: string;
  };
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

// Helper function to calculate days until expiry
const calculateDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Helper function to determine expiry status with new thresholds:
// CRITICAL = ≤ 180 days (6 months)
// WARNING = 181-365 days (6-12 months)
// GOOD = > 365 days (1 year+)
const getExpiryStatus = (days: number): 'GOOD' | 'WARNING' | 'CRITICAL' | 'EXPIRED' => {
  if (days < 0) return 'EXPIRED';
  if (days <= 180) return 'CRITICAL';     // 6 months or less = CRITICAL
  if (days <= 365) return 'WARNING';      // 6-12 months = WARNING
  return 'GOOD';                           // More than 1 year = GOOD
};

export const batchService = {
  // Get all batches
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/batches');
      
      if (response.data.success) {
        // Calculate expiry status for each batch
        const batches = (response.data.data || []).map((batch: Batch) => {
          const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date);
          return {
            ...batch,
            days_until_expiry: daysUntilExpiry,
            expiry_status: getExpiryStatus(daysUntilExpiry)
          };
        });
        
        return { ...response.data, data: batches };
      }
      
      return response.data;
    } catch (error) {
      console.error('Get batches error:', error);
      throw error;
    }
  },

  // Get single batch
  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/batches/${id}`);
      
      if (response.data.success) {
        const batch = response.data.data;
        const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date);
        
        return {
          ...response.data,
          data: {
            ...batch,
            days_until_expiry: daysUntilExpiry,
            expiry_status: getExpiryStatus(daysUntilExpiry)
          }
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Get batch error:', error);
      throw error;
    }
  },

  // Get batches by medicine
  getByMedicine: async (medicineId: number) => {
    try {
      const response = await axiosInstance.get(`/medicines/${medicineId}/batches`);
      
      if (response.data.success) {
        const batches = (response.data.data?.batches || []).map((batch: Batch) => {
          const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date);
          return {
            ...batch,
            days_until_expiry: daysUntilExpiry,
            expiry_status: getExpiryStatus(daysUntilExpiry)
          };
        });
        
        return {
          ...response.data,
          data: {
            ...response.data.data,
            batches
          }
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Get medicine batches error:', error);
      throw error;
    }
  },

  // Get expiring batches (within next 180 days = 6 months)
  getExpiring: async (days: number = 180) => {
    try {
      const response = await axiosInstance.get('/batches/expiring', { params: { days } });
      
      if (response.data.success) {
        const batches = (response.data.data || []).map((batch: Batch) => {
          const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date);
          return {
            ...batch,
            days_until_expiry: daysUntilExpiry,
            expiry_status: getExpiryStatus(daysUntilExpiry)
          };
        });
        
        return { ...response.data, data: batches };
      }
      
      return response.data;
    } catch (error) {
      console.error('Get expiring batches error:', error);
      throw error;
    }
  },

  // Get ONLY expired batches (days < 0)
  getExpired: async () => {
    try {
      const response = await axiosInstance.get('/batches');
      
      if (response.data.success) {
        // Calculate days and filter expired
        const expired = (response.data.data || [])
          .map((batch: Batch) => {
            const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiry_date);
            return {
              ...batch,
              days_until_expiry: daysUntilExpiry,
              expiry_status: getExpiryStatus(daysUntilExpiry)
            };
          })
          .filter((batch: Batch) => (batch.days_until_expiry || 0) < 0);
        
        return { success: true, data: expired };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Get expired batches error:', error);
      throw error;
    }
  },

  // Create batch
  create: async (data: BatchFormData) => {
    try {
      const response = await axiosInstance.post('/batches', data);
      return response.data;
    } catch (error) {
      console.error('Create batch error:', error);
      throw error;
    }
  },

  // Update batch
  update: async (id: number, data: Partial<BatchFormData>) => {
    try {
      const response = await axiosInstance.put(`/batches/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update batch error:', error);
      throw error;
    }
  },

  // Delete batch
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/batches/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete batch error:', error);
      throw error;
    }
  },

  // Adjust stock
  adjustStock: async (id: number, quantity: number, operation: 'add' | 'remove', reason?: string) => {
    try {
      const response = await axiosInstance.patch(`/batches/${id}/stock`, {
        quantity,
        operation,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error('Adjust stock error:', error);
      throw error;
    }
  }
};
