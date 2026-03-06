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