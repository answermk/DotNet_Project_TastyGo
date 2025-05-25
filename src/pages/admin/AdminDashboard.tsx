import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Dashboard from './Dashboard';
import OrderList from './OrderList';
import MenuManagement from './MenuManagement';
import CustomerManagement from './CustomerManagement';
import FeedbackManagement from './FeedbackManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import AuditLogs from './AuditLogs';
import BackupManagement from "./BackupManagement";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="admin" />
      <div className="flex-grow">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="menus" element={<MenuManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="feedback" element={<FeedbackManagement />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="backup" element={<BackupManagement />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;