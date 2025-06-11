import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import userService, { User } from '../services/userService';
import UserForm from '../components/users/UserForm';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/dashboard', { state: { accessDenied: true } });
    }
  }, [currentUser, navigate]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newUser = await userService.createUser(userData);
      setUsers([...users, newUser]);
      setIsCreating(false);
      setSuccessMessage('User created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUser(selectedUser.id, userData);
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setSelectedUser(null);
      setSuccessMessage('User updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        setSuccessMessage('User deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        console.error('Error deleting user:', err);
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  };

  if (isLoading) return (
    <MainLayout>
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-500">Loading users...</div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
          {!isCreating && !selectedUser && (
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
            >
              Add New User
            </button>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {(isCreating || selectedUser) ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {isCreating ? 'Create New User' : 'Edit User'}
              </h2>
              <button 
                onClick={() => {
                  setIsCreating(false);
                  setSelectedUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            <UserForm 
              user={selectedUser || undefined}
              onSubmit={isCreating ? handleCreateUser : handleUpdateUser}
              isLoading={isSubmitting}
            />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'manager'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(user.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* Prevent editing/deleting yourself */}
                        {currentUser?.id !== user.id ? (
                          <>
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400">Current User</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Users; 