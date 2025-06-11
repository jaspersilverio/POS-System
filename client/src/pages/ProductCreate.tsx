import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProductForm from '../components/products/ProductForm';

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Add New Product</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Back to Products
          </button>
        </div>
        
        <ProductForm isEditing={false} />
      </div>
    </MainLayout>
  );
};

export default ProductCreate; 