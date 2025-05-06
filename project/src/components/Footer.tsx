import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram,
  MapPin 
} from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Logo className="w-8 h-8 mr-2" />
              <span className="font-bold text-xl">TastyGo</span>
            </div>
            <p className="text-gray-300 mb-4">
              Fast and tasty food delivered to your doorstep. Connecting you with the best local restaurants.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/cuisines" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Cuisines
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors duration-200">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  123 Food Street, Cuisine City, FC 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">support@tastygo.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-md transition-colors duration-200"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} TastyGo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;