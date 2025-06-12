import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import dashboardService, { DashboardStatistics } from '../services/dashboardService';
import { Link } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user was redirected here due to insufficient permissions
  const accessDenied = location.state && (location.state as any).accessDenied;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await dashboardService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
      fetchDashboardData();
    }
  }, [token]);
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format price
  const formatPrice = (price: any): string => {
    // Convert to number and check if valid
    const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (numPrice === null || numPrice === undefined || isNaN(numPrice)) {
      return '₱0.00';
    }
    return `₱${numPrice.toFixed(2)}`;
  };
  
  // Format chart data
  const prepareChartData = (salesData: Record<string, number>) => {
    const labels = Object.keys(salesData).map(date => {
      return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    const data = Object.values(salesData);
    
    return {
      labels,
      datasets: [
        {
          label: 'Sales',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return formatPrice(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return formatPrice(value);
          }
        }
      }
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading dashboard data...</div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 p-4 rounded-md">
          <div className="text-red-700">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {accessDenied && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Access Denied:</span> You don't have sufficient permissions to access the requested page.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Welcome back, {user?.name}! <span className="inline-block px-2 py-1 ml-2 bg-blue-100 text-blue-800 text-xs rounded-full">{user?.role}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/pos')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Open POS
        </button>
      </div>
      
      {stats && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Products
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.total_products}
                </dd>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Low Stock Items
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.low_stock_items}
                </dd>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Sales
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {formatPrice(stats.total_sales)}
                </dd>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Customer Feedback
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.average_rating}/5
                </dd>
              </div>
            </div>
          </div>
          
          {/* Sales chart */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Sales Last 7 Days
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6" style={{ height: '300px' }}>
              {stats && Object.keys(stats.sales_by_day).length > 0 ? (
                <Bar 
                  data={prepareChartData(stats.sales_by_day)} 
                  options={chartOptions}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No sales data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Role-based feature summary */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Role-Based Access
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <h4 className="font-medium text-gray-900 mb-2">As a <span className="font-bold text-blue-600">{user?.role}</span>, you can:</h4>
              
              {user?.role === 'cashier' && (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Process sales transactions through the POS system</li>
                  <li>View products and their details</li>
                  <li>View transaction history</li>
                  <li>Submit customer feedback</li>
                </ul>
              )}
              
              {user?.role === 'manager' && (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Process sales transactions through the POS system</li>
                  <li>View and manage products (add, edit, delete)</li>
                  <li>View and manage inventory</li>
                  <li>View transaction history and reports</li>
                  <li>Access customer feedback and analytics</li>
                </ul>
              )}
              
              {user?.role === 'admin' && (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Full system access including all manager capabilities</li>
                  <li>Manage user accounts and roles</li>
                  <li>Configure system settings</li>
                  <li>Delete transactions and feedback</li>
                  <li>Access all reports and analytics</li>
                </ul>
              )}
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Transactions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Transactions
                </h3>
                <Link to="/transactions" className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </Link>
              </div>
              <div className="px-4 py-5 sm:p-6 overflow-hidden">
                {stats.recent_transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent transactions</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.recent_transactions.map((transaction) => (
                          <tr 
                            key={transaction.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/transactions?id=${transaction.id}`)}
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{transaction.receipt_number}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.created_at)}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.items_count} items</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{formatPrice(transaction.total_amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            
            {/* Low Stock Items */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Low Stock Items
                </h3>
                {user?.role !== 'cashier' && (
                  <Link to="/inventory" className="text-sm text-blue-600 hover:text-blue-800">
                    View All
                  </Link>
                )}
              </div>
              <div className="px-4 py-5 sm:p-6 overflow-hidden">
                {stats.low_stock_products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No low stock items</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                          <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.low_stock_products.map((product) => (
                          <tr 
                            key={product.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => user?.role !== 'cashier' ? navigate(`/products/${product.id}/edit`) : null}
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                            <td className={`px-3 py-2 whitespace-nowrap text-sm text-center font-medium ${
                              product.current_stock <= product.min_stock ? 'text-red-600' : 'text-gray-900'
                            }`}>{product.current_stock}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-500">{product.min_stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard; 