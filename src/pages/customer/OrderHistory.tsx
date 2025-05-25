import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Package, ChevronDown, ChevronUp, Sun, Moon, RefreshCw } from 'lucide-react';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotifications();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.title = 'Order History | TastyGo';
    if (user) {
      fetchOrders();
    } else {
      setError('User not authenticated');
      setIsLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:7047/api/orders/user/${user.id}`);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders. Please check your connection or try again later.');
      addNotification('error', 'Failed to fetch orders', 'Error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchOrders();
      addNotification('success', 'Orders refreshed successfully', 'Success');
    } catch (err) {
      addNotification('error', 'Failed to refresh orders', 'Error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'confirmed', 'preparing', 'out-for-delivery'].includes(order.status);
    if (filter === 'completed') return order.status === 'delivered';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-indigo-100 text-indigo-800';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Orders</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Track and manage your orders</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-orange-100 text-orange-800'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('all')}
            >
              All Orders
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'active'
                  ? 'bg-orange-100 text-orange-800'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'completed'
                  ? 'bg-orange-100 text-orange-800'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {error && (
        <div className={`mb-4 p-4 rounded ${
          theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
        }`}>
          {error}
          <button 
            onClick={fetchOrders}
            className={`ml-4 underline hover:opacity-80 ${
              theme === 'dark' ? 'text-red-200' : 'text-red-700'
            }`}
          >
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={`rounded-lg shadow-md p-8 text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <Package className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No orders found</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            {filter === 'all' 
              ? "You haven't placed any orders yet."
              : filter === 'active'
              ? "You don't have any active orders."
              : "You don't have any completed orders."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className={`rounded-lg shadow-md overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div
                className={`px-6 py-4 cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="mr-4">
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 text-orange-500">
                        <Package className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Order from {order.restaurantName}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/-/g, ' ')}
                    </span>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {order.total.toLocaleString()} RWF
                    </span>
                    {expandedOrderId === order.id ? (
                      <ChevronUp className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                </div>
              </div>
              {expandedOrderId === order.id && (
                <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="space-y-4">
                    <div>
                      <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {item.quantity}x {item.name}
                              </span>
                            </div>
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {(item.price * item.quantity).toLocaleString()} RWF
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Total</span>
                      <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {order.total.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;