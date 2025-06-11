import apiService from '../utils/api';
import { 
  InventoryListResponse, 
  InventoryResponse,
  LowStockResponse,
  Inventory
} from '../types/product';

class InventoryService {
  /**
   * Get all inventory items
   */
  async getAllInventory(): Promise<Inventory[]> {
    const token = localStorage.getItem('token');
    const response = await apiService.get<InventoryListResponse>('/inventory', token);
    return response.inventory;
  }

  /**
   * Get inventory by ID
   */
  async getInventoryById(id: number): Promise<Inventory> {
    const token = localStorage.getItem('token');
    const response = await apiService.get<InventoryResponse>(`/inventory/${id}`, token);
    return response.inventory;
  }

  /**
   * Update inventory
   */
  async updateInventory(
    id: number, 
    data: { quantity?: number; min_stock_level?: number }
  ): Promise<Inventory> {
    const token = localStorage.getItem('token');
    const response = await apiService.put<InventoryResponse>(`/inventory/${id}`, data, token);
    return response.inventory;
  }

  /**
   * Restock inventory
   */
  async restockInventory(
    id: number, 
    quantity: number
  ): Promise<Inventory> {
    const token = localStorage.getItem('token');
    const response = await apiService.post<InventoryResponse>(`/inventory/${id}/restock`, { quantity }, token);
    return response.inventory;
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(): Promise<{ count: number; items: Inventory[] }> {
    const token = localStorage.getItem('token');
    const response = await apiService.get<LowStockResponse>('/low-stock', token);
    return {
      count: response.low_stock_count,
      items: response.low_stock_items
    };
  }
}

export default new InventoryService(); 