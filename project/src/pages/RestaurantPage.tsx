import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Star, MapPin, ChevronLeft, Info, Heart, Share2 } from 'lucide-react';
import MenuItemCard from '../components/MenuItemCard';
import { Restaurant } from '../types/Restaurant';
import { MenuItem } from '../types/MenuItem';
import { mockRestaurants, mockMenuItems } from '../data/mockData';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // In a real app, fetch restaurant and menu from API
    const fetchRestaurantAndMenu = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundRestaurant = mockRestaurants.find(r => r.id === id);
        if (foundRestaurant) {
          setRestaurant(foundRestaurant);
          
          // Filter menu items for this restaurant
          const restaurantMenu = mockMenuItems.filter(item => item.restaurantId === id);
          setMenuItems(restaurantMenu);
          
          // Set first category as active
          if (restaurantMenu.length > 0) {
            const categories = new Set(restaurantMenu.map(item => item.category));
            setActiveCategory(Array.from(categories)[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch restaurant details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurantAndMenu();
  }, [id]);
  
  // Extract unique categories from menu items
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  
  // Scroll to category section when clicking on category
  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const yOffset = -80; // Adjust for navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Restaurant Not Found</h2>
        <p className="mb-6 text-gray-600">The restaurant you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Restaurant Image */}
      <div className="relative h-64 md:h-80 w-full">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute top-4 left-4">
          <Link 
            to="/" 
            className="flex items-center text-white bg-black/50 hover:bg-black/70 px-3 py-2 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full px-4 pb-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center mb-1">
                  <div className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-md mr-2">
                    Open
                  </div>
                  <div className="flex items-center bg-white/90 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {restaurant.name}
                </h1>
                <p className="text-white/90 text-sm md:text-base">{restaurant.cuisineType} • ${restaurant.priceLevel}</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-colors duration-200">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-colors duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center text-gray-600 text-sm md:text-base">
            <div className="flex items-center mr-6 mb-2 md:mb-0">
              <MapPin className="w-4 h-4 mr-1 text-green-600" />
              <span>{restaurant.distance} km away</span>
            </div>
            <div className="flex items-center mr-6 mb-2 md:mb-0">
              <Clock className="w-4 h-4 mr-1 text-green-600" />
              <span>{restaurant.deliveryTime} min delivery</span>
            </div>
            {restaurant.freeDelivery && (
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-1 text-orange-500" />
                <span className="text-orange-500 font-medium">Free Delivery</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Menu Categories Navbar */}
        <div className="sticky top-16 z-20 bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex p-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeCategory === category
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => scrollToCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Menu Sections */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} id={`category-${category}`}>
              <h2 className="text-xl font-bold mb-4 text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <MenuItemCard 
                      key={item.id} 
                      menuItem={item} 
                      restaurantName={restaurant.name}
                      restaurantId={restaurant.id}
                    />
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;