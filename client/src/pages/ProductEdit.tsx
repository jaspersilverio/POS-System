import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProductForm from '../components/products/ProductForm';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id) : undefined;
  
  if (!productId) {
    // Redirect if no valid product ID
    navigate('/products');
    return null;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Back to Products
          </button>
        </div>
        
        <ProductForm isEditing={true} productId={productId} />
      </div>
    </MainLayout>
  );
};

export default ProductEdit; 