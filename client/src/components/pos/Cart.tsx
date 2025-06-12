import React from 'react';
import { CartItem } from '../../types/cart';

interface CartProps {
  items: CartItem[];
  updateItem: (id: number, quantity: number, discount: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  total: number;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  items, 
  updateItem, 
  removeItem, 
  clearCart, 
  total, 
  onCheckout 
}) => {
  // Format price function
  const formatPrice = (price: number): string => {
    // Ensure price is a number
    const numPrice = Number(price);
    return isNaN(numPrice) ? "₱0.00" : `₱${numPrice.toFixed(2)}`;
  };
  
  // Calculate item total with discount
  const calculateItemTotal = (item: CartItem): number => {
    const itemPrice = Number(item.product.price) || 0;
    const itemTotal = itemPrice * item.quantity;
    const discountAmount = (item.discount / 100) * itemTotal;
    return itemTotal - discountAmount;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
        {items.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear Cart
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 text-center">Your cart is empty</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto mb-4">
          {items.map(item => (
            <div key={item.product.id} className="border-b pb-3 mb-3">
              <div className="flex justify-between">
                <div className="flex-grow">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.sku}</p>
                </div>
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="flex items-center mt-2">
                <div className="flex items-center border rounded mr-4">
                  <button 
                    onClick={() => updateItem(item.product.id, Math.max(1, item.quantity - 1), item.discount)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button 
                    onClick={() => updateItem(item.product.id, item.quantity + 1, item.discount)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm mr-2">Discount %:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.discount}
                    onChange={(e) => updateItem(
                      item.product.id, 
                      item.quantity, 
                      Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                    )}
                    className="border rounded w-16 px-2 py-1 text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-sm">
                <div>
                  <span>{formatPrice(Number(item.product.price) || 0)} × {item.quantity}</span>
                  {item.discount > 0 && (
                    <span className="ml-2 text-green-600">
                      (-{item.discount}%)
                    </span>
                  )}
                </div>
                <span className="font-medium">{formatPrice(calculateItemTotal(item))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Total:</span>
          <span className="text-xl font-bold">{formatPrice(total)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className={`w-full py-2 px-4 rounded font-medium text-white ${
            items.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart; 