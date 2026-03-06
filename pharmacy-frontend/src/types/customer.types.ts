export interface Customer {
  customer_id: number;
  name: string;
  phone: string;
  address: string | null;
  total_visits: number;
  last_visit: string;
  created_at: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  address?: string;
}