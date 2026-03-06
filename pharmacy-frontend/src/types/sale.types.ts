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

export interface SaleFormData {
  phone: string;
  name: string;
  prescription_id: string;
  doctor_name?: string;
  items: Array<{
    batch_id: number;
    quantity: number;
  }>;
  payment_method: 'cash' | 'transfer' | 'card' | 'insurance';
  discount?: number;
  tax?: number;
}