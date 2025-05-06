import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Heart, 
  Bell, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'payment'>('profile');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-green-600 text-white">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-white overflow-hidden mr-4">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">{user?.name}</h2>
                    <p className="text-green-100">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'profile'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>My Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'orders'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('orders')}
                    >
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      <span>My Orders</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'addresses'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('addresses')}
                    >
                      <MapPin className="w-5 h-5 mr-3" />
                      <span>My Addresses</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                        activeTab === 'payment'
                          ? 'bg-green-50 text-green-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab('payment')}
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      <span>Payment Methods</span>
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/favorites"
                      className="w-full flex items-center px-4 py-3 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Heart className="w-5 h-5 mr-3" />
                      <span>Favorites</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/notifications"
                      className="w-full flex items-center px-4 py-3 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Bell className="w-5 h-5 mr-3" />
                      <span>Notifications</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      className="w-full flex items-center px-4 py-3 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <HelpCircle className="w-5 h-5 mr-3" />
                      <span>Help & Support</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          defaultValue={user?.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          defaultValue={user?.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          defaultValue="+1 (555) 123-4567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-sm text-gray-500">Order #1234</span>
                          <h3 className="font-medium">Burger Beast</h3>
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Delivered
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          <p>June 15, 2025 • $24.99</p>
                          <p>2 items</p>
                        </div>
                        <button className="text-green-600 hover:text-green-700 font-medium">
                          Reorder
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-sm text-gray-500">Order #1122</span>
                          <h3 className="font-medium">Pizza Paradise</h3>
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Delivered
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          <p>June 10, 2025 • $32.50</p>
                          <p>3 items</p>
                        </div>
                        <button className="text-green-600 hover:text-green-700 font-medium">
                          Reorder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">My Addresses</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium">Home</h3>
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Default</span>
                          </div>
                          <p className="text-gray-600 text-sm">123 Main Street, Apt 4B</p>
                          <p className="text-gray-600 text-sm">New York, NY 10001</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-600 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium mb-1">Work</h3>
                          <p className="text-gray-600 text-sm">456 Business Ave, Floor 12</p>
                          <p className="text-gray-600 text-sm">New York, NY 10002</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-600 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center w-full md:w-auto transition-colors duration-200">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add New Address
                  </button>
                </div>
              )}
              
              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Methods</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-blue-600 text-white p-2 rounded-md mr-3">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4832</p>
                            <p className="text-sm text-gray-600">Expires 04/27</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Default</span>
                          <button className="text-gray-600 hover:text-gray-900">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center w-full md:w-auto transition-colors duration-200">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Payment Method
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;