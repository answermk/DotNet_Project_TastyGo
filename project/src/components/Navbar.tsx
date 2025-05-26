import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu,
  X,
  LogOut,
  MapPin,
  Utensils
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-md">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo className="w-auto h-8 mr-2" />
            <span className="font-bold text-xl text-gray-800">TastyGo</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors duration-200">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-green-600 transition-colors duration-200">
                Cuisines
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link to="/?cuisine=italian" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Italian</Link>
                  <Link to="/?cuisine=chinese" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Chinese</Link>
                  <Link to="/?cuisine=mexican" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mexican</Link>
                  <Link to="/?cuisine=indian" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Indian</Link>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors duration-200">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors duration-200">
                  <User className="w-6 h-6" />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/profile/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <button 
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cuisines
            </button>
            <div className="pl-6 space-y-1">
              <Link 
                to="/?cuisine=italian" 
                className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Italian
              </Link>
              <Link 
                to="/?cuisine=chinese" 
                className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Chinese
              </Link>
              <Link 
                to="/?cuisine=mexican" 
                className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Mexican
              </Link>
              <Link 
                to="/?cuisine=indian" 
                className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Indian
              </Link>
            </div>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/profile/orders" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="mt-4 space-y-2 px-3">
                <Link 
                  to="/login" 
                  className="block w-full py-2 text-center font-medium text-green-600 hover:text-green-700 rounded-md border border-green-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full py-2 text-center font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
            
            <Link 
              to="/cart" 
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartItems.length > 0 && (
                <span className="ml-2 text-sm text-white bg-orange-500 px-2 py-1 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;