import React, { useState } from 'react';
import { CartItem, PaymentDetails } from '../../types/cart';
import Receipt from './Receipt';
import transactionService from '../../services/transactionService';

interface PaymentProps {
  total: number;
  items: CartItem[];
  onCancel: () => void;
  onComplete: () => void;
}

const Payment: React.FC<PaymentProps> = ({ 
  total, 
  items, 
  onCancel, 
  onComplete 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'other'>('cash');
  const [amountPaid, setAmountPaid] = useState<string>(total.toFixed(2));
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Calculate change
  const calculateChange = (): number => {
    const paid = parseFloat(amountPaid) || 0;
    return Math.max(0, paid - total);
  };

  // Validate payment
  const validatePayment = (): boolean => {
    if (paymentMethod === 'cash') {
      const paid = parseFloat(amountPaid) || 0;
      return paid >= total;
    }
    
    if (paymentMethod === 'card') {
      // Basic validation for card details
      return (
        cardDetails.cardNumber.replace(/\s/g, '').length >= 13 && 
        cardDetails.cardHolder.trim().length > 0 &&
        cardDetails.expiryDate.trim().length > 0 &&
        cardDetails.cvv.trim().length >= 3
      );
    }
    
    return true;
  };

  // Handle payment processing
  const processPayment = async () => {
    if (!validatePayment()) {
      if (paymentMethod === 'cash') {
        setError('Amount paid must be at least the total amount');
      } else {
        setError('Please fill in all card details correctly');
      }
      return;
    }

    setError(null);
    setProcessingPayment(true);

    try {
      // Prepare payment details
      const paymentDetails: PaymentDetails = {
        method: paymentMethod,
        amountPaid: parseFloat(amountPaid) || total,
        change: paymentMethod === 'cash' ? calculateChange() : 0
      };
      
      // If card payment, add mock card details
      if (paymentMethod === 'card') {
        paymentDetails.cardDetails = {
          last4: cardDetails.cardNumber.slice(-4),
          cardType: getCardType(cardDetails.cardNumber),
          authCode: Math.random().toString(36).substring(2, 10).toUpperCase()
        };
      }
      
      // Calculate subtotal (without discounts)
      const subtotal = items.reduce((sum, item) => {
        return sum + (Number(item.product.price) * item.quantity);
      }, 0);
      
      // Create transaction data matching backend expectations
      const transactionData = {
        items,
        paymentDetails,
        subtotal,
        total,
        customerEmail: ''
      };
      
      // Create transaction
      const response = await transactionService.createTransaction(transactionData);
      
      setTransactionId(response.transaction.id);
      setPaymentComplete(true);
      
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Determine card type from card number
  const getCardType = (number: string): string => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.slice(0, 2);
    
    if (number.startsWith('4')) return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'Mastercard';
    if (['34', '37'].includes(firstTwoDigits)) return 'American Express';
    if (['60', '65'].includes(firstTwoDigits)) return 'Discover';
    
    return 'Unknown';
  };

  // Format a credit card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({...cardDetails, cardNumber: formatted});
  };

  // Format price
  const formatPrice = (price: number): string => {
    // Ensure price is a number
    const numPrice = Number(price);
    return isNaN(numPrice) ? "₱0.00" : `₱${numPrice.toFixed(2)}`;
  };

  // Render payment complete screen
  if (paymentComplete) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
        <div className="text-center py-6">
          <div className="text-green-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Complete!</h2>
          <p className="text-gray-600 mb-6">
            Transaction ID: {transactionId}
          </p>
          
          {paymentMethod === 'cash' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Amount Paid:</span>
                <span>{formatPrice(parseFloat(amountPaid) || 0)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Change:</span>
                <span>{formatPrice(calculateChange())}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => setShowReceipt(true)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
            >
              View Receipt
            </button>
            
            <button
              onClick={onComplete}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded"
            >
              New Sale
            </button>
          </div>
        </div>
        
        {showReceipt && transactionId && (
          <Receipt 
            transactionId={transactionId} 
            onClose={() => setShowReceipt(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Payment</h2>
        <button 
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Cart
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="font-medium mb-2">Payment Method</div>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`px-4 py-2 rounded-lg ${
              paymentMethod === 'cash' 
                ? 'bg-blue-100 border border-blue-500 text-blue-700' 
                : 'bg-gray-100 border border-gray-300 text-gray-700'
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod('card')}
            className={`px-4 py-2 rounded-lg ${
              paymentMethod === 'card' 
                ? 'bg-blue-100 border border-blue-500 text-blue-700' 
                : 'bg-gray-100 border border-gray-300 text-gray-700'
            }`}
          >
            Card
          </button>
          <button
            onClick={() => setPaymentMethod('other')}
            className={`px-4 py-2 rounded-lg ${
              paymentMethod === 'other' 
                ? 'bg-blue-100 border border-blue-500 text-blue-700' 
                : 'bg-gray-100 border border-gray-300 text-gray-700'
            }`}
          >
            Other
          </button>
        </div>
        
        {paymentMethod === 'cash' && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountPaid">
                Amount Paid
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">₱</span>
                <input
                  id="amountPaid"
                  type="number"
                  step="0.01"
                  min={total}
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="shadow appearance-none border rounded-r-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Change:</span>
                <span>{formatPrice(calculateChange())}</span>
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                maxLength={19}
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardHolder">
                Card Holder
              </label>
              <input
                id="cardHolder"
                type="text"
                value={cardDetails.cardHolder}
                onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="MM/YY"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvv">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  maxLength={4}
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}
        
        {paymentMethod === 'other' && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p>Other payment methods will be processed manually.</p>
            <p className="font-medium mt-2">Total to collect: {formatPrice(total)}</p>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <button
          onClick={processPayment}
          disabled={processingPayment}
          className={`w-full py-3 px-4 rounded font-medium text-white ${
            processingPayment 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {processingPayment ? 'Processing...' : `Complete Payment (${formatPrice(total)})`}
        </button>
      </div>
    </div>
  );
};

export default Payment; 