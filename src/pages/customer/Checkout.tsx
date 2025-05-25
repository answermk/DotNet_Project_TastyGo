import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Package, CreditCard, Banknote } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';

const Checkout: React.FC = () => {
  const { cart, selectedRestaurant, placeOrder } = useOrders();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const { theme } = useTheme();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'momo-pay' | 'cash'>('momo-pay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
    
      const order = await placeOrder(deliveryAddress, paymentMethod);
      
      addNotification(
          'success',
        'Order placed successfully!',
        'Success'
      );
      
      // Redirect to order details
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      if (err.message && err.message.includes('not found')) {
        setError('Order service is currently unavailable. Please try again later.');
      } else {
        setError('Failed to place order. Please check your connection or try again later.');
      }
      addNotification(
        'error',
        'Failed to place order',
        'Error'
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedRestaurant || cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please add items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('/restaurants')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const total = subtotal + selectedRestaurant.deliveryFee;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Checkout</h1>
        
        {error && (
          <div className={`mb-4 p-4 rounded ${
            theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
          }`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h2>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                rows={3}
                placeholder="Enter your delivery address..."
                required
              />
            </div>
          </div>
          
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-4">
                <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                    value="momo-pay"
                      checked={paymentMethod === 'momo-pay'}
                      onChange={() => setPaymentMethod('momo-pay')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="flex items-center text-gray-700">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Mobile Money
                  </span>
                    </label>
                <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                    value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                  <span className="flex items-center text-gray-700">
                    <Banknote className="h-5 w-5 mr-2" />
                      Cash on Delivery
                  </span>
                    </label>
              </div>
            </div>
        </div>
        
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{subtotal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-900">{selectedRestaurant.deliveryFee.toLocaleString()} RWF</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-base font-medium text-gray-900">{total.toLocaleString()} RWF</span>
                  </div>
                </div>
                  </div>
                </div>
              </div>
              
          <div className="flex justify-end">
                <button
                  type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                'Place Order'
                  )}
                </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;