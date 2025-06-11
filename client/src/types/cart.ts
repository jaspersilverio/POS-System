import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  discount: number; // Percentage discount (0-100)
}

export interface PaymentDetails {
  method: 'cash' | 'card' | 'other';
  amountPaid: number;
  change?: number;
  cardDetails?: {
    last4: string;
    cardType: string;
    authCode: string;
  };
}

export interface Transaction {
  id: number;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  paymentDetails: PaymentDetails;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  receiptNumber: string;
  status: 'completed' | 'refunded' | 'partially_refunded';
}

export interface ReceiptData {
  transaction: Transaction;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  taxId?: string;
}

export type TransactionListResponse = {
  transactions: Transaction[];
};

export type TransactionResponse = {
  transaction: Transaction;
}; 