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
  medicine?: Medicine;
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