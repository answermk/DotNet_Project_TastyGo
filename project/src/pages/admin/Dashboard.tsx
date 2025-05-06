import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
}

interface DailyStats {
  date: string;
  orders: number;
  revenue: number;
}

const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch order statistics
        const { data: orderStats, error: statsError } = await supabase
          .from('orders')
          .select('status, total_amount');

        if (statsError) throw statsError;

        const pendingOrders = orderStats?.filter(order => 
          ['pending', 'confirmed', 'preparing'].includes(order.status)
        ).length || 0;

        const totalRevenue = orderStats?.reduce((sum, order) => 
          sum + (order.total_amount || 0), 0
        ) || 0;

        setStats({
          totalOrders: orderStats?.length || 0,
          totalRevenue,
          averageOrderValue: orderStats?.length ? totalRevenue / orderStats.length : 0,
          pendingOrders
        });

        // Fetch daily statistics for the chart
        const { data: dailyData, error: dailyError } = await supabase
          .from('orders')
          .select('created_at, total_amount')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (dailyError) throw dailyError;

        const dailyStats = dailyData?.reduce((acc: Record<string, DailyStats>, order) => {
          const date = new Date(order.created_at).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { date, orders: 0, revenue: 0 };
          }
          acc[date].orders += 1;
          acc[date].revenue += order.total_amount || 0;
          return acc;
        }, {});

        setDailyStats(Object.values(dailyStats || {}));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user || userRole !== 'admin') {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Average Order</p>
              <p className="text-2xl font-semibold">${stats.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Orders</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Revenue</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;