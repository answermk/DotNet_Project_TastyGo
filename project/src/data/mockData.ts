import { Restaurant } from '../types/Restaurant';
import { MenuItem } from '../types/MenuItem';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Paradise',
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    cuisineType: 'Italian',
    priceLevel: '$$',
    distance: 1.2,
    deliveryTime: 25,
    freeDelivery: true,
    description: 'Authentic Italian pizzas made in a wood-fired oven with fresh ingredients.'
  },
  {
    id: '2',
    name: 'Burger Beast',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    cuisineType: 'American',
    priceLevel: '$$',
    distance: 0.8,
    deliveryTime: 20,
    freeDelivery: false,
    description: 'Juicy burgers with premium beef patties and gourmet toppings.'
  },
  {
    id: '3',
    name: 'Sushi Supreme',
    image: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    cuisineType: 'Japanese',
    priceLevel: '$$$',
    distance: 1.5,
    deliveryTime: 35,
    freeDelivery: true,
    description: 'Fresh, authentic sushi and Japanese cuisine made by expert chefs.'
  },
  {
    id: '4',
    name: 'Taco Town',
    image: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.3,
    cuisineType: 'Mexican',
    priceLevel: '$',
    distance: 1.0,
    deliveryTime: 25,
    freeDelivery: false,
    description: 'Authentic Mexican street food with a modern twist.'
  },
  {
    id: '5',
    name: 'Curry House',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.6,
    cuisineType: 'Indian',
    priceLevel: '$$',
    distance: 1.8,
    deliveryTime: 30,
    freeDelivery: true,
    description: 'Rich, flavorful curries and traditional Indian dishes.'
  },
  {
    id: '6',
    name: 'Noodle Bar',
    image: 'https://images.pexels.com/photos/955137/pexels-photo-955137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.4,
    cuisineType: 'Chinese',
    priceLevel: '$',
    distance: 0.7,
    deliveryTime: 15,
    freeDelivery: false,
    description: 'Hand-pulled noodles and authentic Chinese cuisine.'
  }
];

export const mockMenuItems: MenuItem[] = [
  // Pizza Paradise Menu Items
  {
    id: 'pp1',
    restaurantId: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, fresh mozzarella, basil, and extra virgin olive oil',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Pizza',
    isVegetarian: true
  },
  {
    id: 'pp2',
    restaurantId: '1',
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, and pepperoni',
    price: 14.99,
    image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Pizza'
  },
  {
    id: 'pp3',
    restaurantId: '1',
    name: 'Meat Lover\'s Pizza',
    description: 'Tomato sauce, mozzarella, pepperoni, sausage, bacon, and ham',
    price: 16.99,
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Pizza'
  },
  {
    id: 'pp4',
    restaurantId: '1',
    name: 'Veggie Pizza',
    description: 'Tomato sauce, mozzarella, bell peppers, mushrooms, onions, and olives',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Pizza',
    isVegetarian: true
  },
  {
    id: 'pp5',
    restaurantId: '1',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan cheese, and Caesar dressing',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Salads',
    isVegetarian: true
  },
  {
    id: 'pp6',
    restaurantId: '1',
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter and herbs',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1707917/pexels-photo-1707917.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Sides',
    isVegetarian: true
  },
  {
    id: 'pp7',
    restaurantId: '1',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 7.99,
    image: 'https://images.pexels.com/photos/14705135/pexels-photo-14705135.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Desserts',
    isVegetarian: true
  },
  
  // Burger Beast Menu Items
  {
    id: 'bb1',
    restaurantId: '2',
    name: 'Classic Cheeseburger',
    description: 'Beef patty, cheddar cheese, lettuce, tomato, onion, pickles, and special sauce',
    price: 10.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Burgers'
  },
  {
    id: 'bb2',
    restaurantId: '2',
    name: 'Bacon BBQ Burger',
    description: 'Beef patty, bacon, cheddar, BBQ sauce, lettuce, and grilled onions',
    price: 13.99,
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Burgers'
  },
  {
    id: 'bb3',
    restaurantId: '2',
    name: 'Mushroom Swiss Burger',
    description: 'Beef patty, Swiss cheese, sautéed mushrooms, and garlic aioli',
    price: 12.99,
    image: 'https://images.pexels.com/photos/3219547/pexels-photo-3219547.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Burgers'
  },
  {
    id: 'bb4',
    restaurantId: '2',
    name: 'Veggie Burger',
    description: 'Plant-based patty, lettuce, tomato, onion, and vegan mayo',
    price: 11.99,
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Burgers',
    isVegetarian: true
  },
  {
    id: 'bb5',
    restaurantId: '2',
    name: 'French Fries',
    description: 'Crispy golden fries with seasoning',
    price: 3.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Sides',
    isVegetarian: true
  },
  {
    id: 'bb6',
    restaurantId: '2',
    name: 'Onion Rings',
    description: 'Beer-battered onion rings with dipping sauce',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1839264/pexels-photo-1839264.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Sides',
    isVegetarian: true
  },
  {
    id: 'bb7',
    restaurantId: '2',
    name: 'Chocolate Milkshake',
    description: 'Rich and creamy chocolate milkshake topped with whipped cream',
    price: 5.99,
    image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Drinks',
    isVegetarian: true
  }
];