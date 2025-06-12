import apiService from '../utils/api';
import { 
  ProductListResponse, 
  ProductResponse, 
  Product,
  ProductFormData
} from '../types/product';

class ProductService {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    const token = localStorage.getItem('token');
    const response = await apiService.get<ProductListResponse>('/products', token);
    return response.products;
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const token = localStorage.getItem('token');
    const response = await apiService.get<ProductResponse>(`/products/${id}`, token);
    return response.product;
  }

  /**
   * Create a new product
   */
  async createProduct(productData: FormData): Promise<Product> {
    const token = localStorage.getItem('token');
    const response = await apiService.post<ProductResponse>('/products', productData, token, true);
    return response.product;
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: number, productData: FormData): Promise<Product> {
    const token = localStorage.getItem('token');
    const response = await apiService.put<ProductResponse>(`/products/${id}`, productData, token, true);
    return response.product;
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    await apiService.delete(`/products/${id}`, token);
  }
}

export default new ProductService(); 