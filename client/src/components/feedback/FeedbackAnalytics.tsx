import React, { useState, useEffect } from 'react';
import feedbackService from '../../services/feedbackService';
import FeedbackGaugeChart from './FeedbackGaugeChart';

interface FeedbackStatistics {
  count: number;
  average_rating: number;
  rating_distribution: Record<number, { count: number, percentage: number }>;
}

const FeedbackAnalytics: React.FC = () => {
  const [statistics, setStatistics] = useState<FeedbackStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await feedbackService.getStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching feedback statistics:', err);
        setError('Failed to load feedback statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">Loading feedback statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!statistics || statistics.count === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <p>No feedback data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall statistics with gauge chart */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Overall Satisfaction</h3>
          
          <FeedbackGaugeChart 
            value={statistics.average_rating} 
            maxValue={5} 
            label="out of 5" 
            count={statistics.count}
          />
        </div>

        {/* Rating distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
          
          {[5, 4, 3, 2, 1].map((rating) => {
            const data = statistics.rating_distribution[rating] || { count: 0, percentage: 0 };
            return (
              <div key={rating} className="mb-3">
                <div className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-gray-700 mr-2">{rating}</span>
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 w-16 text-right">
                    <span className="text-sm text-gray-500">{data.count} ({data.percentage}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics; 