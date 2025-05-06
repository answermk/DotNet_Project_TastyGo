import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Clock, 
  ShoppingBag,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  delivery_address: string;
}

const CustomerDashboard = () => {
  const { user, userRole } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentOrders(data || []);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRecentOrders();
    }
  }, [user]);

  if (!user || userRole !== 'customer') {
    return <Navigate to="/login" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.user_metadata.full_name}!</h1>
        <p className="opacity-90">Track your orders and manage your preferences</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/menu"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-1">Order Now</h2>
              <p className="text-gray-600 text-sm">Browse our delicious menu</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-1">Your Profile</h2>
              <p className="text-gray-600 text-sm">Update your preferences</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Link>

        <Link
          to="/orders"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-1">Order History</h2>
              <p className="text-gray-600 text-sm">View all your orders</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link 
              to="/orders" 
              className="text-green-600 hover:text-green-700 flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 text-center">
            <div className="w-8 h-8 border-t-4 border-green-600 border-solid rounded-full animate-spin mx-auto"></div>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="font-medium">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="truncate">{order.delivery_address}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No orders yet. Ready to try our delicious food?
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;