// src/pages/Unauthorized.tsx
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">403 - Access Denied</h1>
      <p className="mb-6">You don't have permission to view this page</p>
      <button 
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
}