// pages/POS.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products', {
        credentials: 'include',
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - discount;
  };

  const handleCheckout = async () => {
    try {
      const transaction = {
        items: cart,
        subtotal: calculateSubtotal(),
        discount,
        total: calculateTotal(),
        payment_method: paymentMethod,
        amount_paid: amountPaid,
        change: amountPaid - calculateTotal(),
        reference_number: referenceNumber,
      };

      const response = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(transaction),
      });

      if (response.ok) {
        const data = await response.json();
        // Generate receipt
        const receiptResponse = await fetch(
          `http://localhost:8000/api/receipts/generate/${data.id}`,
          {
            credentials: 'include',
          }
        );
        const receipt = await receiptResponse.json();
        
        // Print receipt
        window.open(`http://localhost:8000/api/receipts/print/${receipt.id}`, '_blank');
        
        // Clear cart
        setCart([]);
        setDiscount(0);
        setAmountPaid(0);
        setReferenceNumber('');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Products Grid */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Dripline POS</h2>
        <div className="grid grid-cols-3 gap-4">
          {products.map(product => (
            <div
              key={product.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => addToCart(product)}
            >
              <h3 className="font-bold">{product.name}</h3>
              <p>₱{product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-1/3 bg-gray-100 p-4">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p>₱{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="mt-8 space-y-4">
          <div>
            <label className="block">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
              <option value="card">Card</option>
            </select>
          </div>

          {paymentMethod === 'gcash' && (
            <div>
              <label className="block">Reference Number</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div>
            <label className="block">Discount</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block">Amount Paid</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₱{calculateSubtotal().toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>₱{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₱{calculateTotal().toFixed(2)}</span>
            </div>
            {paymentMethod === 'cash' && (
              <div className="flex justify-between">
                <span>Change:</span>
                <span>₱{(amountPaid - calculateTotal()).toFixed(2)}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;