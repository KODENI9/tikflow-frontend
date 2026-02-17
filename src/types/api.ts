// src/types/api.ts

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  fullname?: string;
  phone_number?: string;
  role: 'client' | 'admin';
  status: string;
  balance: number;
  last_feedback_at?: any;
  last_login: any; // Firestore Timestamp or Date string
  created_at: any;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'achat_coins' | 'recharge';
  payment_method: 'flooz' | 'tmoney' | 'moov' | 'skthib';
  ref_id: string;
  amount_cfa: number;
  amount_coins: number;
  tiktok_username?: string;
  status: 'pending' | 'completed' | 'rejected' | 'failed';
  admin_note?: string;
  created_at: any;
}

export interface ReceivedPayment {
  id: string;
  ref_id: string;
  amount: number;
  sender_phone: string;
  raw_sms: string;
  status: 'unused' | 'used';
  received_at: any;
}

export interface Package {
  id: string;
  name: string;
  coins: number;
  price_cfa: number;
  active: boolean;
}

export interface AdminStats {
  todayCount: number;
  todayVolume: number;
  totalRevenue: number;
  creditedCount: number;
  pendingCount: number;
  totalUsers: number;
  successRate: number;
  trendCount: number;
  trendSuccess: number;
}

export interface TransactionDetail {
  transaction: Transaction;
  evidence: ReceivedPayment | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'recharge_success' | 'recharge_error' | 'order_delivered' | 'system_alert' | 'payment_received' | 'success' | 'warning';
  link?: string;
  read: boolean;
  created_at: any;
}

export interface Recipient {
  id: string;
  operator: 'flooz' | 'tmoney' | 'moov' | 'mtn' | 'orange' | 'skthib';
  phone: string;
  beneficiary_name: string;
  active: boolean;
  created_at: any;
}

export interface Feedback {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  context: string;
  nps_score: 'promoter' | 'neutral' | 'detractor';
  created_at: any;
  user?: {
    fullname: string;
    phone_number: string;
    email: string;
  };
}
