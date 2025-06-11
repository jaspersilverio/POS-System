import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProductList from '../components/pos/ProductList';
import Cart from '../components/pos/Cart';
import Payment from '../components/pos/Payment';
import productService from '../services/productService';
import { Product } from '../types/product';
import { CartItem } from '../types/cart';

const Pos: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      // Ensure all products have a numeric price
      const processedData = data.map(product => ({
        ...product,
        price: Number(product.price) || 0
      }));
      setProducts(processedData.filter(product => product.active));
      setError(null);
    } catch (err) {
      setError('Error fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const addToCart = (product: Product) => {
    // Ensure product price is a number
    const safeProduct = {
      ...product,
      price: Number(product.price) || 0
    };
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === safeProduct.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(item => 
          item.product.id === safeProduct.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { product: safeProduct, quantity: 1, discount: 0 }];
      }
    });
  };
  
  const updateCartItem = (id: number, quantity: number, discount: number = 0) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === id 
          ? { ...item, quantity, discount } 
          : item
      )
    );
  };
  
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== id));
  };
  
  const clearCart = () => {
    setCart([]);
    setShowPayment(false);
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const cartTotal = cart.reduce((sum, item) => {
    const itemPrice = Number(item.product.price) || 0;
    const itemTotal = itemPrice * item.quantity;
    const discountAmount = (item.discount / 100) * itemTotal;
    return sum + (itemTotal - discountAmount);
  }, 0);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Point of Sale</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/transactions')}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Transaction History
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Listing - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or category..."
                  className="w-full px-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-xl text-gray-500">Loading products...</div>
                </div>
              ) : (
                <ProductList 
                  products={filteredProducts} 
                  onAddToCart={addToCart} 
                />
              )}
            </div>
          </div>
          
          {/* Cart - Right Side */}
          <div className="lg:col-span-1">
            {!showPayment ? (
              <Cart 
                items={cart} 
                updateItem={updateCartItem}
                removeItem={removeFromCart}
                clearCart={clearCart}
                total={cartTotal}
                onCheckout={() => setShowPayment(true)}
              />
            ) : (
              <Payment 
                total={cartTotal} 
                items={cart}
                onCancel={() => setShowPayment(false)}
                onComplete={clearCart}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pos; 