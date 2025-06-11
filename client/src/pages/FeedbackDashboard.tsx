import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import FeedbackAnalytics from '../components/feedback/FeedbackAnalytics';
import FeedbackList from '../components/feedback/FeedbackList';

const FeedbackDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'list'>('analytics');

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Customer Feedback Dashboard</h1>
          <button
            onClick={() => navigate('/transactions')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Back to Transactions
          </button>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                className={`inline-block p-4 rounded-t-lg border-b-2 ${
                  activeTab === 'analytics'
                    ? 'text-blue-600 border-blue-600'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 rounded-t-lg border-b-2 ${
                  activeTab === 'list'
                    ? 'text-blue-600 border-blue-600'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('list')}
              >
                All Feedback
              </button>
            </li>
          </ul>
        </div>

        {/* Tab content */}
        <div className="mb-6">
          {activeTab === 'analytics' ? (
            <FeedbackAnalytics />
          ) : (
            <FeedbackList />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FeedbackDashboard; 