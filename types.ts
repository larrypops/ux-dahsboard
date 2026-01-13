
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash?: string;
  role: string;
  is_verified: boolean;
  email_verified_at?: Date;
  email_status: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  product_id: string;
  product_name: string;
  amount: number;
  currency: 'XAF';
  status: 'pending' | 'completed' | 'failed';
  payment_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_id: string;
  order_reference: string;
  customer_email: string;
  product_id: string;
  amount: number;
  currency: 'XAF';
  status: 'pending' | 'completed' | 'failed';
  provider: string;
  raw_payload: any;
  created_at: Date;
  updated_at: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  dataset_id?: string;
  created_at: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;          // ex: "25 000 FCFA"
  price_numeric: number;  // x: 25000
  created_at: Date;
  updated_at: Date;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  paymentSuccessRate: number;
  failedPayments: number;
  averageBasket: number;
  topProduct: string;
  userCount: number;
  leadCount: number;
}

export interface ChartDataPoint {
  [key: string]: any;
  date: string;
  value: number;
}

export interface StatusDistribution {
  [key: string]: any;
  name: string;
  value: number;
  color: string;
}

export interface ProductPerformance {
  [key: string]: any;
  name: string;
  orders: number;
}

export interface DashboardResponse {
  orders: Order[];
  stats: AdminStats;
  charts: {
    revenueEvolution: ChartDataPoint[];
    ordersHistogram: ChartDataPoint[];
    paymentDistribution: StatusDistribution[];
    topProducts: ProductPerformance[];
  };
}

export type FilterType = 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface DateRange {
  start: string;
  end: string;
}

export type AppView = 'overview' | 'performance' | 'transactions' | 'sql' | 'settings';

export interface QueryResult {
  columns: string[];
  rows: any[];
  executionTime: number;
  rowCount: number;
}
