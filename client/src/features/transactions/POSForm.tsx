import { useState } from 'react';
import { api } from '../../services/api';

type CartItem = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
};

// Error type guard
function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export default function POSForm() {
  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discount;

  // Add product to cart
  const addToCart = (product: { id: number; name: string; price: number }) => {
    const existingItem = cartItems.find(item => item.product_id === product.id);
    
    if (existingItem) {
      updateQuantity(
        cartItems.indexOf(existingItem),
        existingItem.quantity + 1
      );
    } else {
      setCartItems([...cartItems, { 
        product_id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }]);
    }
  };

  // Update quantity
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  // Remove item
  const removeItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Checkout

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const response = await api.post('/transactions', {
        customer_name: customerName,
        items: cartItems.map(item => ({ 
          product_id: item.product_id, 
          quantity: item.quantity 
        })),
        discount,
        subtotal,
        total
      });
      
      alert(`Transaction #${response.data.id} saved!`);
      setCartItems([]);
      setCustomerName('');
      setDiscount(0);
    } catch (error: unknown) {
      console.error('Checkout Error:', error);
      alert(
        isErrorWithMessage(error) 
          ? `Checkout failed: ${error.message}`
          : 'An unknown error occurred'
      );
    } finally {
      setIsProcessing(false);
    }
  };



  // mga product ni
  const sampleProducts = [
  { id: 1, name: 'Floral Summer Dress', price: 1299.99 },
  { id: 2, name: 'Denim Jacket', price: 1999.99 }
];


  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Point of Sale</h2>
      <div className="space-y-4">
  <h2 className="text-xl font-semibold">Select Product</h2>


  {sampleProducts.map(product => (
    <div key={product.id} className="flex justify-between items-center">
      <div>{product.name} - ₱{product.price.toFixed(2)}</div>
      <button 
        onClick={() => addToCart(product)} 
        className="px-2 py-1 bg-blue-500 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  ))}
</div>

      
      {/* Customer Info */}
      <div className="mb-6">
        <label className="block mb-2">Customer Name (Optional)</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 w-full"
          placeholder="Walk-in customer"
        />
      </div>

      {/* Cart Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Cart Items</h3>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items added yet</p>
        ) : (
          <ul className="space-y-3">
            {cartItems.map((item, index) => (
              <li key={`${item.product_id}-${index}`} className="flex justify-between items-center border-b pb-2">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p>₱{item.price.toFixed(2)} × {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, parseInt(e.target.value || '1'))}
                    className="border p-1 w-16"
                  />
                  <button 
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <label className="flex items-center">
            Discount:
            <input
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) => setDiscount(Math.min(Number(e.target.value), subtotal))}
              className="border p-1 ml-2 w-20"
            />
          </label>
          <span>-₱{discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || isProcessing}
        className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${
          cartItems.length === 0 || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Process Transaction'}
      </button>
    </div>
  );
}