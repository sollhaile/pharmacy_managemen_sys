export interface Supplier {
  supplier_id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  total_purchases?: number;
  total_spent?: number;
}

export interface SupplierBatch {
  batch_id: number;
  batch_number: string;
  medicine_name: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  expiry_date: string;
  created_at: string;
}

export interface SupplierDetails extends Supplier {
  batches: SupplierBatch[];
  total_batches: number;
  total_units: number;
  total_value: number;
}

export interface SupplierFormData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface PurchaseOrderData {
  supplier_id: number;
  items: Array<{
    medicine_id: number;
    quantity: number;
    unit_price?: number;
  }>;
  notes?: string;
}
