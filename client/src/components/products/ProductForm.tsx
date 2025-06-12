import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { Product, ProductFormData } from '../../types/product';

interface ProductFormProps {
  isEditing: boolean;
  productId?: number;
  initialData?: ProductFormData;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isEditing,
  productId,
  initialData
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: '',
      description: '',
      price: 0,
      sku: '',
      category: '',
      image_url: '',
      active: true,
      quantity: 0,
      min_stock_level: 10
    }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    // If editing and no initial data is provided, fetch the product data
    if (isEditing && productId && !initialData) {
      const fetchProduct = async () => {
        try {
          setIsSubmitting(true);
          const product = await productService.getProductById(productId);
          
          setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            sku: product.sku,
            category: product.category,
            image_url: product.image_url || '',
            active: product.active,
            quantity: product.inventory?.quantity || 0,
            min_stock_level: product.inventory?.min_stock_level || 10
          });
          
          if (product.image_url) {
            setImagePreview(product.image_url);
          }
          
          setError(null);
        } catch (err) {
          console.error('Error fetching product:', err);
          setError('Failed to load product data. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };
      
      fetchProduct();
    }
  }, [isEditing, productId, initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else if (name === 'price' || name === 'quantity' || name === 'min_stock_level') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      data.append('sku', formData.sku);
      data.append('category', formData.category);
      data.append('active', formData.active ? '1' : '0');
      data.append('quantity', String(formData.quantity));
      data.append('min_stock_level', String(formData.min_stock_level));
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditing && productId) {
        await productService.updateProduct(productId, data);
      } else {
        await productService.createProduct(data);
      }
      navigate('/products');
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, err);
      setError(`Failed to ${isEditing ? 'update' : 'create'} product. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Product Name*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sku">
                SKU*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sku"
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="Enter SKU"
                disabled={isEditing} // SKU should not be editable when editing
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price*
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">₱</span>
                <input
                  className="shadow appearance-none border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Enter category"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter product description"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                Product Image
              </label>
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
              )}
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: JPEG, PNG, JPG, GIF, SVG. Max size: 2MB
              </p>
            </div>
            
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                {isEditing ? 'Quantity' : 'Initial Quantity'}
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="min_stock_level">
                Min Stock Level
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="min_stock_level"
                type="number"
                name="min_stock_level"
                value={formData.min_stock_level}
                onChange={handleChange}
                min="1"
                placeholder="10"
              />
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Active</span>
              </label>
            </div>
            
            <div className="col-span-2">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isEditing ? 'Updating...' : 'Creating...') 
                    : (isEditing ? 'Update Product' : 'Create Product')
                  }
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 