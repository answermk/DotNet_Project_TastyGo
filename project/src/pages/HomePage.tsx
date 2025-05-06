import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import FoodCategorySlider from '../components/FoodCategorySlider';
import { Restaurant } from '../types/Restaurant';
import { mockRestaurants } from '../data/mockData';

const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, you would fetch restaurants from your API
    const fetchRestaurants = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants based on selected cuisine and search query
    let filtered = restaurants;

    if (selectedCuisine) {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisineType.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) || 
        restaurant.cuisineType.toLowerCase().includes(query)
      );
    }

    setFilteredRestaurants(filtered);
  }, [selectedCuisine, searchQuery, restaurants]);

  const handleCuisineSelect = (cuisine: string) => {
    setSelectedCuisine(cuisine === selectedCuisine ? '' : cuisine);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect above
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Fast and Tasty Food Delivered to You
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Order from your favorite local restaurants with just a few taps
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="pl-4">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  className="w-full py-4 px-3 text-gray-700 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 focus:outline-none transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Food Categories */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse by Category</h2>
          <FoodCategorySlider onCuisineSelect={handleCuisineSelect} selectedCuisine={selectedCuisine} />
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCuisine ? `${selectedCuisine} Restaurants` : 'Popular Restaurants Near You'}
            </h2>
            <button className="flex items-center text-green-600 hover:text-green-700">
              <Filter className="w-4 h-4 mr-1" />
              <span>Filters</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 h-64 animate-pulse">
                  <div className="w-full h-32 bg-gray-300 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600 mb-4">No restaurants found for your search.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCuisine('');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="bg-orange-100 py-12 my-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Free Delivery on Your First Order</h2>
              <p className="text-gray-700 mb-4">Use code <span className="font-semibold text-orange-600">TASTYFIRST</span> at checkout</p>
              <Link 
                to="/restaurants"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors duration-200"
              >
                Order Now
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg w-full md:w-auto">
              <img 
                src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Delicious food" 
                className="w-full h-48 md:w-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-gray-800 text-center">How TastyGo Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-green-600">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Restaurants</h3>
              <p className="text-gray-600">Find your favorite restaurants and cuisines in your area</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-green-600">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Order with Ease</h3>
              <p className="text-gray-600">Customize your order and pay securely online</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-green-600">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Food</h3>
              <p className="text-gray-600">Get your food delivered to your doorstep and enjoy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;