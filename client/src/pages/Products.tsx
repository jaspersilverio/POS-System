import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { Product } from '../types/product';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNotCashier = user?.role !== 'cashier';
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Error deleting product');
        console.error(err);
      }
    }
  };
  
  // Format price safely
  const formatPrice = (price: any): string => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? `$${price}` : `$${numPrice.toFixed(2)}`;
  };
  
  if (loading) return (
    <MainLayout>
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading products...</div>
      </div>
    </MainLayout>
  );
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
          {isNotCashier && (
            <button 
              onClick={() => navigate('/products/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Add New Product
            </button>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.inventory ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            Qty: {product.inventory.quantity}
                          </div>
                          <div className="text-xs text-gray-500">
                            Min: {product.inventory.min_stock_level}
                          </div>
                          {product.inventory.quantity <= product.inventory.min_stock_level && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Low Stock
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not tracked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isNotCashier ? (
                        <>
                          <button 
                            onClick={() => navigate(`/products/${product.id}/edit`)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">View only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products; 