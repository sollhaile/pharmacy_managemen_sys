export interface Customer {
  customer_id: number;
  name: string;
  phone: string;
  address: string | null;
  total_visits: number;
  last_visit: string;
  created_at: string;
}

export interface CustomerSale {
  sale_id: number;
  invoice_number: string;
  sale_date: string;
  total_amount: number;
  prescription_id: string;
  doctor_name: string | null;
  items: CustomerSaleItem[];
}

export interface CustomerSaleItem {
  medicine_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerDetails extends Customer {
  sales: CustomerSale[];
  total_spent: number;
  average_purchase: number;
  favorite_category: string | null;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  address?: string;
}
