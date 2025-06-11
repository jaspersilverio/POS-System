/**
 * Authentication types for the Dripline POS system
 */

export type Role = 'admin' | 'manager' | 'cashier';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
} 