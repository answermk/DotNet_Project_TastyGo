import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../types/MenuItem';
import { useCart } from '../context/CartContext';

interface MenuItemCardProps {
  menuItem: MenuItem;
  restaurantName: string;
  restaurantId: string;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  menuItem, 
  restaurantName,
  restaurantId
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityControl, setShowQuantityControl] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: quantity,
      image: menuItem.image,
      restaurantId: restaurantId,
      restaurantName: restaurantName
    });
    
    // Show success message
    setShowQuantityControl(false);
    setQuantity(1);
  };

  const increaseQuantity = () => {
    setQuantity(prevQuantity => Math.min(prevQuantity + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        <div className="flex-1 p-4">
          <h3 className="font-medium text-gray-800 mb-1">{menuItem.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{menuItem.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">${menuItem.price.toFixed(2)}</span>
            
            {showQuantityControl ? (
              <div className="flex items-center space-x-3">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  onClick={decreaseQuantity}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium w-5 text-center">{quantity}</span>
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  onClick={increaseQuantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  className="ml-2 px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                  onClick={handleAddToCart}
                >
                  Add
                </button>
              </div>
            ) : (
              <button 
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                onClick={() => setShowQuantityControl(true)}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
        
        {menuItem.image && (
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={menuItem.image} 
              alt={menuItem.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;