import { Link } from 'react-router-dom';
import { Clock, Star, MapPin } from 'lucide-react';
import { Restaurant } from '../types/Restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurant/${restaurant.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center">
            <div className="bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-md">
              Open
            </div>
            {restaurant.freeDelivery && (
              <div className="bg-orange-500 text-white text-sm font-medium px-2 py-1 rounded-md ml-2">
                Free Delivery
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
          <div className="flex items-center bg-green-50 px-2 py-1 rounded">
            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
            <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{restaurant.cuisineType}</p>
        
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{restaurant.distance} km away</span>
          <span className="mx-2">•</span>
          <Clock className="w-4 h-4 mr-1" />
          <span>{restaurant.deliveryTime} min</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;