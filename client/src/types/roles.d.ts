export type UserRole = 'admin' | 'manager' | 'cashier';

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface SidebarItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  subItems?: SidebarItem[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number;
  barcode: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}