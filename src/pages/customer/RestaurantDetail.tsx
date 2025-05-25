import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../contexts/OrderContext';
import { ShoppingBag, Clock, Star, Minus, Plus, X } from 'lucide-react';

type CategoryMenuItems = {
  [category: string]: {
    items: any[];
  };
};

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, getRestaurantMenuItems, addToCart, cart, selectRestaurant } = useOrders();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categorizedMenuItems, setCategorizedMenuItems] = useState<CategoryMenuItems>({});
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const restaurant = restaurants.find(r => r.id === id);
  
  useEffect(() => {
    if (!restaurant) {
      navigate('/customer/restaurants');
      return;
    }
    
    document.title = `${restaurant.name} | TastyGo`;
    
    // Set the current restaurant in context
    selectRestaurant(restaurant);
    
    // Get menu items for this restaurant
    const menuItems = getRestaurantMenuItems(restaurant.id);
    
    // Categorize menu items
    const categorized: CategoryMenuItems = {};
    menuItems.forEach(item => {
      if (!categorized[item.category]) {
        categorized[item.category] = { items: [] };
      }
      categorized[item.category].items.push(item);
    });
    
    setCategorizedMenuItems(categorized);
    
    // Set active category to the first one
    if (Object.keys(categorized).length > 0) {
      setActiveCategory(Object.keys(categorized)[0]);
    }
  }, [restaurant, navigate, getRestaurantMenuItems, selectRestaurant]);

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart(selectedItem, quantity, specialInstructions);
    setSelectedItem(null);
    setQuantity(1);
    setSpecialInstructions('');
  };

  const handleCheckout = () => {
    navigate('/customer/checkout');
  };

  if (!restaurant) return null;

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      <div className="bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <p className="mt-1">{restaurant.description}</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  <span>{restaurant.rating} rating</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div>
                  <span>{restaurant.deliveryFee.toLocaleString()} RWF delivery</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-32 h-32 rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-8">
              <h3 className="font-medium text-gray-900 mb-3">Menu Categories</h3>
              <ul className="space-y-2">
                {Object.keys(categorizedMenuItems).map((category) => (
                  <li key={category}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeCategory === category
                          ? 'bg-orange-100 text-orange-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:col-span-3">
            {Object.keys(categorizedMenuItems).map((category) => (
              <div
                key={category}
                id={category}
                className={`mb-8 ${activeCategory !== category ? 'hidden md:block' : ''}`}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categorizedMenuItems[category].items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="md:flex">
                        <div className="md:flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          {item.dietaryInfo && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.dietaryInfo.map((info: string) => (
                                <span 
                                  key={info}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {info}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-orange-600 font-medium">{item.price.toLocaleString()} RWF</p>
                            <button
                              className="inline-flex items-center px-3 py-1 border border-orange-600 text-sm font-medium rounded text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => setSelectedItem(item)}
                              disabled={!item.isAvailable}
                            >
                              {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                            </button>
                          </div>
                        </div>
                        <div className="md:w-32 h-32 md:h-auto">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Fixed cart button at bottom */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="p-2 rounded-lg bg-orange-600 shadow-lg sm:p-3">
              <div className="flex items-center justify-between flex-wrap">
                <div className="w-0 flex-1 flex items-center">
                  <span className="flex p-2 rounded-lg bg-orange-800">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </span>
                  <p className="ml-3 font-medium text-white truncate">
                    <span className="md:hidden">{cartItemsCount} items · {cartTotal.toLocaleString()} RWF</span>
                    <span className="hidden md:inline">{cartItemsCount} items in your cart · Total: {cartTotal.toLocaleString()} RWF</span>
                  </p>
                </div>
                <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                  <button
                    onClick={handleCheckout}
                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-600 bg-white hover:bg-orange-50"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Item details modal */}
      {selectedItem && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  onClick={() => setSelectedItem(null)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {selectedItem.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedItem.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedItem.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{selectedItem.description}</p>
                      {selectedItem.dietaryInfo && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedItem.dietaryInfo.map((info: string) => (
                            <span 
                              key={info}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {info}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-3 text-lg font-medium text-orange-600">
                        {selectedItem.price.toLocaleString()} RWF
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <button
                          type="button"
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-gray-50 text-sm font-medium rounded-l-md text-gray-500 hover:bg-gray-100"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="flex-1 flex items-center justify-center border-t border-b border-gray-300 bg-white text-sm text-gray-700 px-4 py-2">
                          {quantity}
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-gray-50 text-sm font-medium rounded-r-md text-gray-500 hover:bg-gray-100"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                        Special Instructions
                      </label>
                      <textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Any special requests or dietary requirements?"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                      />
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAddToCart}
                        disabled={!selectedItem.isAvailable}
                      >
                        {selectedItem.isAvailable ? 'Add to Cart' : 'Item Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantDetail;