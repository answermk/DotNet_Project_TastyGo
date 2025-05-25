import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { API_CONFIG } from '../config/api';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
};

export type Order = {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  total: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress: string;
  paymentMethod: 'momo-pay' | 'cash';
  paymentStatus: 'pending' | 'completed';
};

export type OrderContextType = {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  cart: OrderItem[];
  orders: Order[];
  selectedRestaurant: Restaurant | null;
  addToCart: (item: MenuItem, quantity: number, specialInstructions?: string) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, quantity: number, specialInstructions?: string) => void;
  clearCart: () => void;
  placeOrder: (deliveryAddress: string, paymentMethod: 'momo-pay' | 'cash') => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getRestaurantMenuItems: (restaurantId: string) => MenuItem[];
  selectRestaurant: (restaurant: Restaurant) => void;
  getMenuItemById: (id: string) => MenuItem | undefined;
  fetchAdminOrders: () => Promise<void>;
  fetchUserOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => { const context = useContext(OrderContext); if (!context) { throw new Error("useOrders must be used within an OrderProvider"); } return context; };

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const auth = useAuth();
  const { addNotification } = useNotifications();
  if (!auth) { throw new Error("useOrders must be used within an OrderProvider (and an AuthProvider)"); }
  const { user, logout } = auth;

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurants
        const restaurantsResponse = await api.get(API_CONFIG.ENDPOINTS.RESTAURANTS.BASE);
        setRestaurants(restaurantsResponse.data);

        // Fetch menu items
        const menuItemsResponse = await api.get(API_CONFIG.ENDPOINTS.RESTAURANTS.MENU);
        setMenuItems(menuItemsResponse.data);

        // Fetch user's orders if logged in
        if (user) {
          await fetchUserOrders();
        }
      } catch (error) {
        // Improved error handling
        addNotification('error', 'Failed to fetch initial data. Please check your connection.', 'Error');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user) return;
    try {
      const ordersResponse = await api.get(`${API_CONFIG.ENDPOINTS.ORDERS.BASE}/user/${user.id}`);
      setOrders(ordersResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setOrders([]);
        return;
      }
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
        addNotification('error', 'Session expired. Please log in again.', 'Unauthorized');
        return;
      }
      setOrders([]);
      addNotification('error', 'Failed to load your orders.', 'Error');
      console.error('Error fetching user orders:', error);
    }
  };

  const fetchAdminOrders = async () => {
    if (!user?.isAdmin) return;
    try {
      const ordersResponse = await api.get(API_CONFIG.ENDPOINTS.ORDERS.BASE);
      setOrders(ordersResponse.data);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          setOrders([]);
          return;
        }
        if (error.response.status === 401 || error.response.status === 403) {
          logout();
          addNotification('error', 'Session expired. Please log in again.', 'Unauthorized');
          return;
        }
      }
      setOrders([]);
      addNotification('error', 'Failed to load admin orders.', 'Error');
    }
  };

  const addToCart = (item: MenuItem, quantity: number, specialInstructions?: string) => {
    // Check if we're adding from a different restaurant
    if (cart.length > 0) {
      const firstItem = menuItems.find(mi => mi.id === cart[0].menuItemId);
      if (firstItem && firstItem.restaurantId !== item.restaurantId) {
        // Clear cart if adding from different restaurant
        setCart([]);
      }
    }
    
    // Check if item already in cart
    const existingItem = cart.find(cartItem => cartItem.menuItemId === item.id);
    
    if (existingItem) {
      // Update existing item
      setCart(cart.map(cartItem => 
        cartItem.menuItemId === item.id 
          ? { 
              ...cartItem, 
              quantity: cartItem.quantity + quantity,
              specialInstructions: specialInstructions || cartItem.specialInstructions 
            } 
          : cartItem
      ));
    } else {
      // Add new item
      setCart([...cart, {
        id: Math.random().toString(36).substring(2, 9),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        specialInstructions,
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartItem = (id: string, quantity: number, specialInstructions?: string) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity, specialInstructions: specialInstructions ?? item.specialInstructions } 
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (deliveryAddress: string, paymentMethod: 'momo-pay' | 'cash'): Promise<Order> => {
    if (!selectedRestaurant || cart.length === 0 || !user) {
      throw new Error('Invalid order data');
    }

    try {
      const orderData = {
        restaurantId: selectedRestaurant.id,
        deliveryAddress,
        paymentMethod,
        orderItems: cart.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity
        }))
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      console.log('Cart items:', JSON.stringify(cart, null, 2));
      console.log('Selected restaurant:', selectedRestaurant);

      const response = await api.post(API_CONFIG.ENDPOINTS.ORDERS.BASE, orderData);
      const newOrder = response.data;
      setOrders([newOrder, ...orders]);
      clearCart();
      return newOrder;
    } catch (error: any) {
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        if (error.response.data.errors) {
          console.error('Validation errors:', JSON.stringify(error.response.data.errors, null, 2));
        }
      }
      if (error.response && error.response.status === 404) {
        addNotification('error', 'Order endpoint not found. Please contact support.', 'Error');
      } else {
        addNotification('error', 'Failed to place order. Please check your connection or try again.', 'Error');
      }
      console.error('Error placing order:', error);
      throw new Error('Failed to place order');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    if (!user?.isAdmin) {
      throw new Error('Unauthorized to update order status');
    }

    try {
      const response = await api.put(`${API_CONFIG.ENDPOINTS.ORDERS.BASE}/${orderId}/status`, { status });
      const updatedOrder = response.data;
      
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  };

  const getRestaurantMenuItems = (restaurantId: string) => {
    return menuItems.filter(item => item.restaurantId === restaurantId);
  };

  const selectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const getMenuItemById = (id: string) => {
    return menuItems.find(item => item.id === id);
  };

  return (
    <OrderContext.Provider 
      value={{ 
        restaurants,
        menuItems,
        cart,
        orders,
        selectedRestaurant,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        placeOrder,
        updateOrderStatus,
        getRestaurantMenuItems,
        selectRestaurant,
        getMenuItemById,
        fetchAdminOrders,
        fetchUserOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};