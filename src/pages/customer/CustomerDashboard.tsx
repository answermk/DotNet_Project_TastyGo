import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Dashboard from './Dashboard';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import OrderHistory from './OrderHistory';
import Profile from './Profile';
import Checkout from './Checkout';
import ChatSupport from './ChatSupport';
import Reports from './Reports';

const CustomerDashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="customer" />
      <div className="flex-grow">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="restaurants" element={<RestaurantList />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="chat" element={<ChatSupport />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomerDashboard;