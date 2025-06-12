import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import transactionService from '../services/transactionService';
import { Transaction } from '../types/cart';
import Receipt from '../components/pos/Receipt';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAllTransactions();
      
      // Process transactions to ensure all numerical values are properly converted
      const processedData = data.map(transaction => ({
        ...transaction,
        total: Number(transaction.total) || 0,
        subtotal: Number(transaction.subtotal) || 0,
        discount: Number(transaction.discount) || 0,
        tax: Number(transaction.tax) || 0,
        items: transaction.items.map(item => ({
          ...item,
          product: {
            ...item.product,
            price: Number(item.product.price) || 0
          }
        }))
      }));
      
      setTransactions(processedData);
      setError(null);
    } catch (err) {
      setError('Error fetching transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format price
  const formatPrice = (price: any): string => {
    // Ensure price is a number
    const numPrice = Number(price);
    return isNaN(numPrice) ? "₱0.00" : `₱${numPrice.toFixed(2)}`;
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
    }).format(date);
  };
  
  if (loading) return (
    <MainLayout>
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading transactions...</div>
      </div>
    </MainLayout>
  );
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Transaction History</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/feedback')}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Feedback Dashboard
            </button>
            <button
              onClick={() => navigate('/pos')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Back to POS
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
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
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.receiptNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.items.length} items</div>
                        <div className="text-xs text-gray-500">
                          {transaction.items.map(item => item.product.name).join(', ').substring(0, 30)}
                          {transaction.items.map(item => item.product.name).join(', ').length > 30 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.paymentDetails.method.toUpperCase()}
                        </div>
                        {transaction.paymentDetails.method === 'card' && transaction.paymentDetails.cardDetails && (
                          <div className="text-xs text-gray-500">
                            {transaction.paymentDetails.cardDetails.cardType} *{transaction.paymentDetails.cardDetails.last4}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(transaction.total)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'refunded'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTransaction(transaction.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {selectedTransaction && (
        <Receipt 
          transactionId={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}
    </MainLayout>
  );
};

export default Transactions; 