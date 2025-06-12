import config from '../config';

/**
 * Base API service for making HTTP requests to the backend
 */
class ApiService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = config.API_URL;
  }
  
  /**
   * Get authentication headers for API requests
   */
  private getHeaders(token?: string | null): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  }
  
  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, token?: string | null, isFormData = false): Promise<T> {
    const headers = this.getHeaders(token);
    if (isFormData) {
      delete (headers as Record<string, string>)['Content-Type'];
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  }
  
  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any, token?: string | null, isFormData = false): Promise<T> {
    const headers = this.getHeaders(token);
    if (isFormData) {
      delete (headers as Record<string, string>)['Content-Type'];
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  }
  
  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 