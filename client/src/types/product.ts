export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  category: string;
  image_url: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  inventory?: Inventory;
}

export interface Inventory {
  id: number;
  product_id: number;
  quantity: number;
  min_stock_level: number;
  last_restock_date: string | null;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  image_url: string;
  active: boolean;
  quantity: number;
  min_stock_level: number;
}

export type ProductListResponse = {
  products: Product[];
};

export type ProductResponse = {
  product: Product;
};

export type InventoryListResponse = {
  inventory: Inventory[];
};

export type InventoryResponse = {
  inventory: Inventory;
};

export type LowStockResponse = {
  low_stock_count: number;
  low_stock_items: Inventory[];
}; 