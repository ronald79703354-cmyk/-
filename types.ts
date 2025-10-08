export enum Role {
  Admin = 'ADMIN',
  Trader = 'TRADER',
  User = 'USER',
}

export enum OrderStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED',
}

export type AccountStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CREDIT_CARD' | 'BANK_TRANSFER';


export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  governorate: string;
  age: number;
  role: Role;
  status?: AccountStatus;
  adminNickname?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Cost price
  minPrice: number;
  maxPrice: number;
  stock: number;
  imageUrl: string;
  images: string[];
  categoryId: number;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
  sellingPrice: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: CartItem[];
  totalCost: number;
  totalRevenue: number;
  netProfit: number;
  status: OrderStatus;
  traderId: number;
  paymentMethod: PaymentMethod;
}

export interface DashboardStats {
  totalTraders: number;
  totalProducts: number;
  monthlyOrders: number;
  monthlyEarnings: number;
  traderGrowth: { name: string; value: number }[];
  salesPerformance: { name: string; value: number }[];
}