import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, X, CreditCard, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;
  
  // Group items by restaurant
  const itemsByRestaurant = cartItems.reduce((acc, item) => {
    const { restaurantId, restaurantName } = item;
    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        restaurantName,
        items: []
      };
    }
    acc[restaurantId].items.push(item);
    return acc;
  }, {} as Record<string, { restaurantName: string; items: typeof cartItems }>);
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call for order placement
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      setOrderSuccess(true);
    }, 2000);
  };
  
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Continue Shopping
              </Link>
              <Link 
                to="/profile/orders"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 ml-4 md:ml-8">Your Cart</h1>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link 
                to="/"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Browse Restaurants
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cart Items */}
            <div className="md:w-2/3">
              {Object.entries(itemsByRestaurant).map(([restaurantId, { restaurantName, items }]) => (
                <div 
                  key={restaurantId}
                  className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
                >
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-medium text-gray-800">{restaurantName}</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {items.map(item => (
                      <div key={item.id} className="px-6 py-4 flex items-center">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                        )}
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="mx-3 w-5 text-center">{item.quantity}</span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="ml-6 w-20 text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        <button 
                          className="ml-4 text-gray-400 hover:text-gray-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Estimated Delivery Time</p>
                        <p className="text-sm text-green-700">30-45 minutes</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 flex justify-center items-center disabled:opacity-70"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <CreditCard className="w-5 h-5 mr-2" />
                    )}
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;