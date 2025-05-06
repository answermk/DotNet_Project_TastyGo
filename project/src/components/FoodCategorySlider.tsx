import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

interface FoodCategory {
  id: string;
  name: string;
  image: string;
}

interface FoodCategorySliderProps {
  onCuisineSelect: (cuisine: string) => void;
  selectedCuisine: string;
}

const FoodCategorySlider: React.FC<FoodCategorySliderProps> = ({ 
  onCuisineSelect, 
  selectedCuisine 
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const categories: FoodCategory[] = [
    {
      id: '1',
      name: 'Pizza',
      image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '2',
      name: 'Burger',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '3',
      name: 'Sushi',
      image: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '4',
      name: 'Indian',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '5',
      name: 'Mexican',
      image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '6',
      name: 'Chinese',
      image: 'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '7',
      name: 'Italian',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '8',
      name: 'Dessert',
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });

      // Check if arrows should be displayed after scrolling
      setTimeout(() => {
        if (sliderRef.current) {
          setShowLeftArrow(sliderRef.current.scrollLeft > 0);
          setShowRightArrow(
            sliderRef.current.scrollLeft + sliderRef.current.clientWidth < sliderRef.current.scrollWidth - 10
          );
        }
      }, 300);
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  return (
    <div className="relative">
      {showLeftArrow && (
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}
      
      <div 
        className="flex space-x-4 overflow-x-auto scrollbar-hide py-4"
        ref={sliderRef}
        onScroll={handleScroll}
      >
        {categories.map(category => (
          <div 
            key={category.id} 
            className="flex-shrink-0"
            onClick={() => onCuisineSelect(category.name)}
          >
            <div 
              className={`w-28 h-28 rounded-lg overflow-hidden relative cursor-pointer transition-transform duration-200 hover:scale-105 ${
                selectedCuisine === category.name ? 'ring-2 ring-offset-2 ring-green-600' : ''
              }`}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-medium">{category.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showRightArrow && (
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default FoodCategorySlider;