import React, { useState, useEffect } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Filter, Search, Eye, Check, ChevronRight } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { downloadReport } from '../../utils/downloadReport';
import { API_CONFIG } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const formats = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
  // { value: 'docx', label: 'Document' }, // (optional)
];

const OrderList: React.FC = () => {
  const { orders, updateOrderStatus, fetchAdminOrders } = useOrders();
  const { addNotification } = useNotifications();
  const auth = useAuth();
  const navigate = useNavigate();
  
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportFormat, setReportFormat] = useState('excel');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Manage Orders | TastyGo Admin';
    
    // Check if user is authenticated and is admin
    if (!auth?.user) {
      navigate('/login', { state: { from: '/admin/orders' } });
      return;
    }
    
    /*if (!auth.user.isAdmin) {
      navigate('/');
      addNotification('error', 'You do not have permission to access this page', 'Access Denied');
      return;
    }*/
    
    loadOrders();
  }, [auth?.user, navigate]);
  
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchAdminOrders();
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      addNotification('error', 'Failed to load orders', 'Error');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter]);
  
  const handleUpdateStatus = async (orderId: string, newStatus: any) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      addNotification(
        'success',
        `Order #${orderId} has been updated to ${newStatus.replace(/-/g, ' ')}.`,
        'Order Status Updated'
      );
    } catch (err) {
      addNotification(
        'error',
        `Failed to update order status: ${err instanceof Error ? err.message : 'Unknown error'}`,
        'Error'
      );
    }
  };
  
  const getSelectedOrder = () => {
    return orders.find(order => order.id === selectedOrder);
  };
  
  const getStatusSteps = () => {
    const statuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    const order = getSelectedOrder();
    
    if (!order) return [];
    
    const currentStatusIndex = statuses.indexOf(order.status);
    
    return statuses.map((status, index) => ({
      name: status.replace(/-/g, ' '),
      completed: index <= currentStatusIndex,
      current: index === currentStatusIndex,
    }));
  };
  
  const getNextStatus = (currentStatus: string) => {
    const statuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex < statuses.length - 1) {
      return statuses[currentIndex + 1];
    }
    
    return null;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Management</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={loadOrders}
            className="ml-4 text-red-700 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button variant="contained" color="primary" onClick={() => setReportDialogOpen(true)}>
              Generate Report
            </Button>
          </div>
          <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
            <DialogTitle>Generate Orders Report</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Format</InputLabel>
                <Select value={reportFormat} onChange={e => setReportFormat(e.target.value)}>
                  {formats.map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink>Date Range</InputLabel>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={e => setReportStartDate(e.target.value)}
                  style={{ marginRight: 8 }}
                />
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={e => setReportEndDate(e.target.value)}
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={async () => {
                  try {
                    await downloadReport(
                      API_CONFIG.ENDPOINTS.ORDERS.REPORT,
                      { 
                        startDate: reportStartDate, 
                        endDate: reportEndDate, 
                        format: reportFormat 
                      },
                      'orders-report',
                      reportFormat
                    );
                    setReportDialogOpen(false);
                  } catch (error) {
                    console.error('Failed to download report:', error);
                    // You might want to show an error notification here
                  }
                }}
                variant="contained"
                color="primary"
              >
                Download
              </Button>
            </DialogActions>
          </Dialog>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="md:w-1/2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                  placeholder="Search by order ID or restaurant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <label htmlFor="status-filter" className="mr-2 text-sm text-gray-600">Filter by status:</label>
              <select
                id="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Orders List</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className={`hover:bg-gray-50 ${selectedOrder === order.id ? 'bg-orange-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.restaurantName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.total.toLocaleString()} RWF
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'preparing' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'out-for-delivery' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status.replace(/-/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setSelectedOrder(order.id)}
                            className="text-orange-600 hover:text-orange-900 mr-3"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          
                          {getNextStatus(order.status) && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status))}
                              className="text-green-600 hover:text-green-900"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="md:col-span-1">
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                  </div>
                  <div className="p-6">
                    {(() => {
                      const order = getSelectedOrder();
                      if (!order) return null;
                      
                      return (
                        <>
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                            <div className="mt-2">
                              <nav aria-label="Progress">
                                <ol className="overflow-hidden">
                                  {getStatusSteps().map((step, stepIdx) => (
                                    <li key={step.name} className={`relative ${stepIdx !== getStatusSteps().length - 1 ? 'pb-8' : ''}`}>
                                      {stepIdx !== getStatusSteps().length - 1 ? (
                                        <div className={`absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 ${step.completed ? 'bg-orange-600' : 'bg-gray-300'}`} aria-hidden="true" />
                                      ) : null}
                                      <div className="relative flex items-start group">
                                        <span className="h-9 flex items-center">
                                          <span className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${
                                            step.completed ? 'bg-orange-600' : 'bg-gray-300'
                                          }`}>
                                            {step.completed ? (
                                              <Check className="w-5 h-5 text-white" />
                                            ) : (
                                              <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                                            )}
                                          </span>
                                        </span>
                                        <span className="ml-4 min-w-0 flex flex-col">
                                          <span className={`text-xs font-semibold uppercase tracking-wide ${step.completed ? 'text-orange-600' : 'text-gray-500'}`}>
                                            {step.name}
                                          </span>
                                        </span>
                                      </div>
                                    </li>
                                  ))}
                                </ol>
                              </nav>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Order Items</h3>
                            <ul className="mt-2 divide-y divide-gray-200">
                              {order.items.map((item) => (
                                <li key={item.id} className="py-2">
                                  <div className="flex justify-between">
                                    <div>
                                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                      <span className="text-sm text-gray-500 ml-1">x{item.quantity}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {(item.price * item.quantity).toLocaleString()} RWF
                                    </span>
                                  </div>
                                  {item.specialInstructions && (
                                    <p className="mt-1 text-xs text-gray-500 italic">
                                      "{item.specialInstructions}"
                                    </p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Order Summary</h3>
                            <dl className="mt-2 divide-y divide-gray-200">
                              <div className="py-2 flex justify-between">
                                <dt className="text-sm text-gray-500">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">
                                  {(order.total - 2000).toLocaleString()} RWF
                                </dd>
                              </div>
                              <div className="py-2 flex justify-between">
                                <dt className="text-sm text-gray-500">Delivery Fee</dt>
                                <dd className="text-sm font-medium text-gray-900">2,000 RWF</dd>
                              </div>
                              <div className="py-2 flex justify-between">
                                <dt className="text-sm font-bold text-gray-900">Total</dt>
                                <dd className="text-sm font-bold text-gray-900">
                                  {order.total.toLocaleString()} RWF
                                </dd>
                              </div>
                            </dl>
                          </div>
                          
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Delivery Information</h3>
                            <p className="mt-1 text-sm text-gray-900">{order.deliveryAddress}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
                            <p className="mt-1 text-sm text-gray-900">Method: {order.paymentMethod === 'momo-pay' ? 'MoMo Pay' : 'Cash on Delivery'}</p>
                            <p className="mt-1 text-sm text-gray-900">
                              Status:{' '}
                              <span className={order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                                {order.paymentStatus}
                              </span>
                            </p>
                          </div>
                          
                          {getNextStatus(order.status) && (
                            <div className="mt-6">
                              <button
                                onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status))}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                              >
                                Update to {getNextStatus(order.status)?.replace(/-/g, ' ')}
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h3 className="text-gray-500 text-sm font-medium">Select an order to view details</h3>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;