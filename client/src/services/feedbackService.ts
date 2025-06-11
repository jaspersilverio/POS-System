import apiService from '../utils/api';

interface FeedbackData {
  transaction_id: number;
  rating: number;
  comment?: string;
  customer_email?: string;
}

interface FeedbackStatistics {
  count: number;
  average_rating: number;
  rating_distribution: Record<number, { count: number, percentage: number }>;
}

interface FeedbackResponse {
  feedback: any;
}

interface FeedbackListResponse {
  feedback: any[];
}

interface FeedbackStatisticsResponse {
  statistics: FeedbackStatistics;
}

const feedbackService = {
  // Submit new feedback
  submitFeedback: async (data: FeedbackData) => {
    const token = localStorage.getItem('token');
    const response = await apiService.post<FeedbackResponse>('/feedback', data, token);
    return response.feedback;
  },
  
  // Get all feedback
  getAllFeedback: async () => {
    const token = localStorage.getItem('token');
    const response = await apiService.get<FeedbackListResponse>('/feedback', token);
    return response.feedback;
  },
  
  // Get feedback for a specific transaction
  getFeedbackByTransaction: async (transactionId: number) => {
    const allFeedback = await feedbackService.getAllFeedback();
    return allFeedback.find((feedback: any) => feedback.transaction_id === transactionId);
  },
  
  // Get feedback statistics
  getStatistics: async () => {
    const token = localStorage.getItem('token');
    const response = await apiService.get<FeedbackStatisticsResponse>('/feedback-statistics', token);
    return response.statistics;
  }
};

export default feedbackService; 