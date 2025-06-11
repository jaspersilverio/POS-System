import apiService from '../utils/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  created_at: string;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'cashier';
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'manager' | 'cashier';
}

interface UserResponse {
  user: User;
}

interface UsersResponse {
  users: User[];
}

const userService = {
  /**
   * Get all users
   */
  getAllUsers: async (): Promise<User[]> => {
    const token = localStorage.getItem('token');
    const response = await apiService.get<UsersResponse>('/users', token);
    return response.users;
  },

  /**
   * Get a user by ID
   * @param id User ID
   */
  getUser: async (id: number): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await apiService.get<UserResponse>(`/users/${id}`, token);
    return response.user;
  },

  /**
   * Create a new user
   * @param userData User data
   */
  createUser: async (userData: UserCreateRequest): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await apiService.post<UserResponse>('/users', userData, token);
    return response.user;
  },

  /**
   * Update a user
   * @param id User ID
   * @param userData User data to update
   */
  updateUser: async (id: number, userData: UserUpdateRequest): Promise<User> => {
    const token = localStorage.getItem('token');
    const response = await apiService.put<UserResponse>(`/users/${id}`, userData, token);
    return response.user;
  },

  /**
   * Delete a user
   * @param id User ID
   */
  deleteUser: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token');
    await apiService.delete(`/users/${id}`, token);
  }
};

export default userService; 