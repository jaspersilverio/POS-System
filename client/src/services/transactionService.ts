import apiService from '../utils/api';
import { 
  Transaction,
  TransactionResponse,
  TransactionListResponse,
  CartItem,
  PaymentDetails
} from '../types/cart';

interface CreateTransactionData {
  items: CartItem[];
  paymentDetails: PaymentDetails;
  subtotal: number;
  total: number;
  customerName?: string;
  customerEmail?: string;
}

class TransactionService {
  /**
   * Get all transactions
   */
  async getAllTransactions(): Promise<Transaction[]> {
    const token = localStorage.getItem('token');
    const response = await apiService.get<TransactionListResponse>('/transactions', token);
    return response.transactions;
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: number): Promise<Transaction> {
    const token = localStorage.getItem('token');
    const response = await apiService.get<TransactionResponse>(`/transactions/${id}`, token);
    return response.transaction;
  }

  /**
   * Create a new transaction
   */
  async createTransaction(transactionData: CreateTransactionData): Promise<TransactionResponse> {
    const token = localStorage.getItem('token');
    const response = await apiService.post<TransactionResponse>('/transactions', transactionData, token);
    return response;
  }

  /**
   * Void or refund a transaction
   */
  async refundTransaction(id: number, amount?: number): Promise<TransactionResponse> {
    const token = localStorage.getItem('token');
    const response = await apiService.post<TransactionResponse>(
      `/transactions/${id}/refund`, 
      { amount }, 
      token
    );
    return response;
  }
}

export default new TransactionService(); 