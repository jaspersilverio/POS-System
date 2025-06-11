import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-blue-600">404</h1>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Page not found</h2>
            <p className="mt-2 text-lg text-gray-600">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound; 