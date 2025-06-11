import apiService from '../utils/api';

export interface DashboardStatistics {
  total_products: number;
  low_stock_items: number;
  total_sales: number;
  average_rating: number;
  recent_transactions: Array<{
    id: number;
    receipt_number: string;
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    cashier: string;
    items_count: number;
  }>;
  low_stock_products: Array<{
    id: number;
    name: string;
    sku: string;
    current_stock: number;
    min_stock: number;
  }>;
  sales_by_day: Record<string, number>;
}

interface DashboardResponse {
  statistics: DashboardStatistics;
}

const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStatistics: async (): Promise<DashboardStatistics> => {
    const token = localStorage.getItem('token');
    const response = await apiService.get<DashboardResponse>('/dashboard/statistics', token);
    return response.statistics;
  }
};

export default dashboardService; 