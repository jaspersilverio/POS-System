import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types/cart';
import transactionService from '../../services/transactionService';
import FeedbackForm from '../feedback/FeedbackForm';
import feedbackService from '../../services/feedbackService';

interface ReceiptProps {
  transactionId: number;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ transactionId, onClose }) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<any>(null);
  const [checkingFeedback, setCheckingFeedback] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCheckingFeedback(true);
        
        // Fetch transaction data
        const data = await transactionService.getTransactionById(transactionId);
        
        // Ensure all numerical values are properly converted
        if (data) {
          const processedData = {
            ...data,
            total: Number(data.total) || 0,
            subtotal: Number(data.subtotal) || 0,
            discount: Number(data.discount) || 0,
            tax: Number(data.tax) || 0,
            paymentDetails: {
              ...data.paymentDetails,
              amountPaid: Number(data.paymentDetails.amountPaid) || 0,
              change: Number(data.paymentDetails.change) || 0
            },
            items: data.items.map(item => ({
              ...item,
              product: {
                ...item.product,
                price: Number(item.product.price) || 0
              },
              quantity: Number(item.quantity) || 0,
              discount: Number(item.discount) || 0
            }))
          };
          setTransaction(processedData);
        } else {
          setTransaction(null);
        }
        
        // Check if feedback exists for this transaction
        const feedback = await feedbackService.getFeedbackByTransaction(transactionId);
        setExistingFeedback(feedback);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
        setCheckingFeedback(false);
      }
    };
    
    fetchData();
  }, [transactionId]);
  
  // Format price
  const formatPrice = (price: number): string => {
    // Ensure price is a number
    const numPrice = Number(price);
    return isNaN(numPrice) ? "$0.00" : `$${numPrice.toFixed(2)}`;
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleFeedback = () => {
    setShowFeedback(true);
  };
  
  // Render star rating
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
          <div className="text-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading receipt...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !transaction) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Failed to load receipt'}</p>
            <button 
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show feedback form if requested
  if (showFeedback) {
    return (
      <FeedbackForm 
        transactionId={transactionId} 
        customerEmail={transaction.customerEmail || ''} 
        onClose={() => setShowFeedback(false)}
        onSubmit={() => {
          setShowFeedback(false);
          // After submitting feedback, update the existingFeedback state
          feedbackService.getFeedbackByTransaction(transactionId)
            .then(feedback => setExistingFeedback(feedback))
            .catch(err => console.error('Error fetching updated feedback:', err));
        }}
      />
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:bg-white print:bg-opacity-100">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-full print:w-full print:max-h-full">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-xl font-semibold">Receipt</h2>
          <div className="flex space-x-2">
            {!checkingFeedback && (
              existingFeedback ? (
                <div className="flex items-center bg-green-100 text-green-800 px-3 py-2 rounded">
                  <span className="mr-2">Feedback: </span>
                  <StarRating rating={existingFeedback.rating} />
                </div>
              ) : (
                <button 
                  onClick={handleFeedback}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                >
                  Leave Feedback
                </button>
              )
            )}
            <button 
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Print
            </button>
            <button 
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="border-b pb-4 mb-4 text-center">
          <h1 className="text-xl font-bold">Dripline POS</h1>
          <p className="text-gray-600">123 Business Street</p>
          <p className="text-gray-600">Cityville, State 12345</p>
          <p className="text-gray-600">Tel: (555) 123-4567</p>
        </div>
        
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold">Receipt #: {transaction.receiptNumber}</p>
            <p className="text-sm text-gray-600">Date: {formatDate(transaction.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${
              transaction.status === 'refunded' ? 'text-red-600' : 
              transaction.status === 'partially_refunded' ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              {transaction.status.toUpperCase().replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Disc%</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transaction.items.map((item, index) => {
                const itemTotal = item.product.price * item.quantity;
                const discountAmount = (item.discount / 100) * itemTotal;
                const totalAfterDiscount = itemTotal - discountAmount;
                
                return (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <div>{item.product.name}</div>
                      <div className="text-xs text-gray-500">{item.product.sku}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      {formatPrice(item.product.price)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      {item.discount > 0 ? `${item.discount}%` : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      {formatPrice(totalAfterDiscount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Subtotal:</span>
            <span>{formatPrice(transaction.subtotal)}</span>
          </div>
          {transaction.discount > 0 && (
            <div className="flex justify-between mb-1 text-green-600">
              <span className="text-sm">Discount:</span>
              <span>-{formatPrice(transaction.discount)}</span>
            </div>
          )}
          {transaction.tax > 0 && (
            <div className="flex justify-between mb-1">
              <span className="text-sm">Tax:</span>
              <span>{formatPrice(transaction.tax)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>{formatPrice(transaction.total)}</span>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="text-sm">
            <div className="font-medium">Payment Information</div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span>{transaction.paymentDetails.method.toUpperCase()}</span>
            </div>
            
            {transaction.paymentDetails.method === 'cash' && (
              <>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>{formatPrice(transaction.paymentDetails.amountPaid)}</span>
                </div>
                {transaction.paymentDetails.change && transaction.paymentDetails.change > 0 && (
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>{formatPrice(transaction.paymentDetails.change)}</span>
                  </div>
                )}
              </>
            )}
            
            {transaction.paymentDetails.method === 'card' && transaction.paymentDetails.cardDetails && (
              <>
                <div className="flex justify-between">
                  <span>Card Type:</span>
                  <span>{transaction.paymentDetails.cardDetails.cardType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Card Number:</span>
                  <span>XXXX-XXXX-XXXX-{transaction.paymentDetails.cardDetails.last4}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Code:</span>
                  <span>{transaction.paymentDetails.cardDetails.authCode}</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">For returns and exchanges please contact us within 30 days.</p>
          {!existingFeedback && !checkingFeedback && (
            <p className="mt-2 print:hidden">
              <button 
                onClick={handleFeedback}
                className="text-blue-600 hover:underline"
              >
                We value your feedback! Click here to rate your experience.
              </button>
            </p>
          )}
          {existingFeedback && (
            <div className="mt-2 print:hidden flex justify-center">
              <div className="bg-green-50 text-green-800 px-3 py-2 rounded flex items-center">
                <span className="mr-2">Thank you for your feedback!</span>
                <StarRating rating={existingFeedback.rating} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipt; 