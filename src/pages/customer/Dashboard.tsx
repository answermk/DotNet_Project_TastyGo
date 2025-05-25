import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Clock, History, ShoppingBag, MessageSquare, FileText, Sun, Moon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const { restaurants, orders } = useOrders();
  const { notifications } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  
  const recentOrders = orders.slice(0, 3);
  const featuredRestaurants = restaurants.slice(0, 4);
  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 3);

  useEffect(() => {
    document.title = 'Dashboard | TastyGo';
  }, []);

  if (!auth) {
    return (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Authentication Error</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const { user } = auth;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Welcome back, {user?.name}</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>What would you like to eat today?</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link 
          to="/customer/restaurants" 
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="p-6 text-white flex flex-col h-full">
            <div className="mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Browse Restaurants</h3>
            <p className="text-orange-100 flex-grow">Discover our selection of restaurants and find your favorite dishes.</p>
            <div className="mt-4 flex justify-end">
              <span className="text-sm font-medium flex items-center">
                Explore <span className="ml-1">→</span>
              </span>
            </div>
          </div>
        </Link>
        
        <Link 
          to="/customer/orders" 
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="p-6 text-white flex flex-col h-full">
            <div className="mb-4">
              <History className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your Orders</h3>
            <p className="text-green-100 flex-grow">Track your current orders and view your order history.</p>
            <div className="mt-4 flex justify-end">
              <span className="text-sm font-medium flex items-center">
                View Orders <span className="ml-1">→</span>
              </span>
            </div>
          </div>
        </Link>
        
        <Link 
          to="/customer/reports" 
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="p-6 text-white flex flex-col h-full">
            <div className="mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Order Reports</h3>
            <p className="text-blue-100 flex-grow">Generate and download reports of your order history.</p>
            <div className="mt-4 flex justify-end">
              <span className="text-sm font-medium flex items-center">
                Generate Report <span className="ml-1">→</span>
              </span>
            </div>
          </div>
        </Link>
        
        <div className="md:col-span-2 lg:col-span-2">
          <div className={`rounded-xl shadow-md overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Featured Restaurants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredRestaurants.map((restaurant) => (
                  <Link 
                    key={restaurant.id}
                    to={`/customer/restaurants/${restaurant.id}`}
                    className={`group transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                    }`}
                  >
                    <div className="h-32 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{restaurant.name}</h4>
                        <div className="flex items-center bg-orange-100 px-2 rounded text-xs font-medium text-orange-800">
                          <span>★</span>
                          <span className="ml-1">{restaurant.rating}</span>
                        </div>
                      </div>
                      <div className={`flex items-center mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link 
                  to="/customer/restaurants"
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  View all restaurants →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl shadow-md overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} pb-4 last:border-0 last:pb-0`}>
                    <div className="flex justify-between">
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{order.restaurantName}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · 
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'out-for-delivery' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>You haven't placed any orders yet.</p>
            )}
            <div className="mt-4">
              <Link 
                to="/customer/orders"
                className="text-orange-600 hover:text-orange-800 text-sm font-medium"
              >
                View all orders →
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`rounded-xl shadow-md overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Need Help?</h3>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-grow">
                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Have questions or need assistance with your orders? Our support team is here to help!</p>
                  <Link
                    to="/customer/chat"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with Support
                  </Link>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <img 
                    src="https://images.pexels.com/photos/7129713/pexels-photo-7129713.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Customer Support" 
                    className="h-40 w-40 object-cover rounded-full border-4 border-orange-100 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl shadow-md overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
            {unreadNotifications.length > 0 ? (
              <div className="space-y-4">
                {unreadNotifications.map((notification) => (
                  <div key={notification.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} pb-4 last:border-0 last:pb-0`}>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{notification.title}</p>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{notification.message}</p>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No new notifications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;