import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../utils/api';
import {
  Users, ShoppingBag, DollarSign, Package, Clock, Sun, Moon
} from 'lucide-react';
import { signalRService } from '../../services/signalRService';

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const user = auth?.user;

  // State for all data
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setAnalytics] = useState<any>(null);

  // Calculate statistics based on requirements
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalCustomers = users.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  // Order status overview
  const statusList = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
  const statusCounts = statusList.map(status => ({
    status,
    count: orders.filter(order => order.status === status).length
  }));

  // Revenue overview (target: 1 million per month)
  const MONTHLY_TARGET = 1000000;
  const currentMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && 
           orderDate.getFullYear() === now.getFullYear();
  });
  const monthlyRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const revenuePercent = Math.min(100, (monthlyRevenue / MONTHLY_TARGET) * 100);

  // Order completion rate
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const completionPercent = totalOrders ? (completedOrders / totalOrders) * 100 : 0;

  // Customer satisfaction based on feedback
  const satisfactionPercent = feedback.length > 0 
    ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length) * 20 // Convert 5-star rating to percentage
    : 0;

  // Popular restaurants based on order frequency
  const popularRestaurants = restaurants.map(restaurant => {
    const restaurantOrders = orders.filter(order => order.restaurantId === restaurant.id);
    return {
      ...restaurant,
      orderCount: restaurantOrders.length,
      percentage: totalOrders ? (restaurantOrders.length / totalOrders) * 100 : 0
    };
  }).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, ordersRes, usersRes, restaurantsRes, feedbackRes] = await Promise.all([
          api.get('/api/orders/analytics'),
          api.get('/api/orders'),
          api.get('/api/users'),
          api.get('/api/restaurants'),
          api.get('/api/feedback')
        ]);

        setAnalytics(analyticsRes.data);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
        setRestaurants(restaurantsRes.data);
        setFeedback(feedbackRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const setupSignalR = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        await signalRService.startConnection(token);
        
        // Update the order status in the local state when it changes
        signalRService.onOrderStatusUpdate((orderId: string, status: string) => {
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId 
                ? { ...order, status } 
                : order
            )
          );
        });

        // Add new order to the local state
        signalRService.onNewOrder((order: any) => {
          setOrders(prevOrders => [order, ...prevOrders]);
        });
      } catch (error) {
        console.error('Failed to setup SignalR connection:', error);
      }
    };

    fetchData();
    setupSignalR();
    return () => {
      signalRService.stopConnection();
    };
  }, []);

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Add this function to handle order status updates
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // TODO: Implement API call to update order status
    console.log(`Update order ${orderId} to status ${newStatus}`);
    // Optionally, update state or refetch orders
  };

  if (loading) return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back, {user?.name}</p>
        </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-lg shadow-md p-6 border-l-4 border-orange-500 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-100 rounded-full p-3">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="text-2xl font-semibold text-gray-900">{totalOrders}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className={`rounded-lg shadow-md p-6 border-l-4 border-green-500 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="text-2xl font-semibold text-gray-900">{totalRevenue.toLocaleString()} RWF</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className={`rounded-lg shadow-md p-6 border-l-4 border-blue-500 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                <dd className="text-2xl font-semibold text-gray-900">{totalCustomers}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className={`rounded-lg shadow-md p-6 border-l-4 border-purple-500 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                <dd className="text-2xl font-semibold text-gray-900">{pendingOrders}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Overview */}
        <div className={`rounded-lg shadow-md p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-600">Monthly Target: 1M RWF</span>
            <span className="text-sm font-medium">{revenuePercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${revenuePercent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Current: {monthlyRevenue.toLocaleString()} RWF
          </p>
        </div>

        {/* Order Completion */}
        <div className={`rounded-lg shadow-md p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Order Completion</h3>
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className="text-sm font-medium">{completionPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {completedOrders} of {totalOrders} orders completed
          </p>
        </div>

        {/* Customer Satisfaction */}
        <div className={`rounded-lg shadow-md p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Customer Satisfaction</h3>
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-600">Satisfaction Rate</span>
            <span className="text-sm font-medium">{satisfactionPercent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-600 h-2.5 rounded-full" 
              style={{ width: `${satisfactionPercent}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Based on {feedback.length} feedback entries
          </p>
        </div>
      </div>

      {/* Popular Restaurants */}
      <div className={`rounded-lg shadow-md mb-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Popular Restaurants</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {popularRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={restaurant.image || '/placeholder-restaurant.jpg'} 
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{restaurant.name}</p>
                    <p className="text-sm text-gray-500">{restaurant.orderCount} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{restaurant.percentage.toFixed(1)}%</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${restaurant.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className={`rounded-lg shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Order Status Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{status.replace(/-/g, ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`rounded-lg shadow-md overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="px-6 py-4">
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">#{order.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Customer #{order.userId}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.restaurantName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.total.toLocaleString()} RWF</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status.replace(/-/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                Confirm
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'preparing')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Start Preparing
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'out-for-delivery')}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Send for Delivery
                              </button>
                            )}
                            {order.status === 'out-for-delivery' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No recent orders.</p>
              )}
              
              <div className="mt-4">
                <Link 
                  to="/admin/orders"
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  View all orders →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className={`rounded-lg shadow-md overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/admin/orders"
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg p-4 text-center transition-colors duration-200"
                >
                  <Package className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Manage Orders</span>
                </Link>
                
                <Link 
                  to="/admin/menus"
                  className="bg-green-100 hover:bg-green-200 text-green-800 rounded-lg p-4 text-center transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm font-medium">Update Menu</span>
                </Link>
                
                <Link 
                  to="/admin/customers"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg p-4 text-center transition-colors duration-200"
                >
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Customers</span>
                </Link>
                
                <Link 
                  to="/admin/feedback"
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg p-4 text-center transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-sm font-medium">Feedback</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;