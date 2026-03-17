export interface SalesReport {
  period: string;
  start_date: string;
  end_date: string;
  summary: {
    total_revenue: number;
    total_profit: number;
    total_transactions: number;
    items_sold: number;
    avg_transaction_value: number;
  };
  daily: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  top_products: Array<{
    medicine_id: number;
    medicine_name: string;
    quantity: number;
    revenue: number;
  }>;
  top_customers: Array<{
    customer_id: number;
    customer_name: string;
    total_spent: number;
    visit_count: number;
  }>;
}

export interface InventoryReport {
  summary: {
    total_value: number;
    total_cost: number;
    total_items: number;
    total_batches: number;
    low_stock_count: number;
    expiring_count: number;
    expired_count: number;
  };
  category_breakdown: Array<{
    category: string;
    value: number;
    count: number;
  }>;
  low_stock_items: Array<{
    medicine_id: number;
    medicine_name: string;
    current_stock: number;
    reorder_level: number;
    shortage: number;
  }>;
  expiring_batches: Array<{
    batch_id: number;
    batch_number: string;
    medicine_name: string;
    expiry_date: string;
    days_left: number;
    quantity: number;
    value: number;
  }>;
}

export interface FinancialReport {
  period: string;
  start_date: string;
  end_date: string;
  revenue: number;
  cogs: number;
  gross_profit: number;
  expenses: {
    wastage: number;
    returns: number;
    other: number;
    total: number;
  };
  net_profit: number;
  profit_margin: number;
  monthly_trend: Array<{
    month: string;
    revenue: number;
    profit: number;
    expenses: number;
  }>;
}

export interface ExpiryReport {
  summary: {
    total_batches: number;
    total_units: number;
    total_value: number;
    expiring_30_days: number;
    expiring_90_days: number;
    expired: number;
  };
  by_month: Array<{
    month: string;
    value: number;
    count: number;
  }>;
  critical_batches: Array<{
    batch_id: number;
    batch_number: string;
    medicine_name: string;
    expiry_date: string;
    days_left: number;
    quantity: number;
    value: number;
    status: 'CRITICAL' | 'WARNING' | 'EXPIRED';
  }>;
}
