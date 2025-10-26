"use client";

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../components/auth/AuthProvider';
import LoginForm from '../components/auth/LoginForm';
import VehicleServiceLayout from '../components/layout/VehicleServiceLayout';
import Dashboard from '../components/dashboard/Dashboard';
import CustomerManagement from '../components/customers/CustomerManagement';
import WorkOrderManagement from '../components/workorders/WorkOrderManagement';
import CallCenterManagement from '../components/callcenter/CallCenterManagement';
import HomeServiceManagement from '../components/homeservice/HomeServiceManagement';
import ServiceCenterManagement from '../components/servicecenter/ServiceCenterManagement';

// Placeholder components for modules not yet implemented
const EngineerManagement = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Engineer Management</h1>
        <p className="text-gray-600">Manage engineers, assignments, and service tracking</p>
      </div>
    </div>
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Engineer Management Module</h2>
      <p className="text-gray-600 mb-6">This module will handle engineer profiles, assignments, and service tracking.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Engineer Profiles</h3>
          <p className="text-sm text-blue-700">Manage engineer information and specializations</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900">Assignment System</h3>
          <p className="text-sm text-green-700">Automatic and manual engineer assignment</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900">Service Tracking</h3>
          <p className="text-sm text-purple-700">Real-time service progress monitoring</p>
        </div>
      </div>
    </div>
  </div>
);

const InventoryManagement = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Manage parts inventory, warehouse operations, and stock levels</p>
      </div>
    </div>
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Inventory Management Module</h2>
      <p className="text-gray-600 mb-6">This module will handle parts inventory, warehouse operations, and stock management.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Parts Inventory</h3>
          <p className="text-sm text-blue-700">Manage parts catalog and stock levels</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900">Warehouse Operations</h3>
          <p className="text-sm text-green-700">Stock management and reorder processes</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900">Supplier Management</h3>
          <p className="text-sm text-purple-700">Supplier relationships and ordering</p>
        </div>
      </div>
    </div>
  </div>
);

const BillingManagement = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
        <p className="text-gray-600">Invoice generation, payment processing, and financial tracking</p>
      </div>
    </div>
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Billing Management Module</h2>
      <p className="text-gray-600 mb-6">This module will handle invoicing, payment processing, and financial management.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Invoice Generation</h3>
          <p className="text-sm text-blue-700">Automatic invoice creation and management</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900">Payment Processing</h3>
          <p className="text-sm text-green-700">Multiple payment methods and tracking</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900">Financial Reports</h3>
          <p className="text-sm text-purple-700">Revenue tracking and financial analytics</p>
        </div>
      </div>
    </div>
  </div>
);

const FeedbackManagement = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-gray-600">Customer feedback, complaints, and satisfaction tracking</p>
      </div>
    </div>
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Feedback Management Module</h2>
      <p className="text-gray-600 mb-6">This module will handle customer feedback, complaints, and satisfaction tracking.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Customer Feedback</h3>
          <p className="text-sm text-blue-700">Collect and analyze customer feedback</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900">Complaint Management</h3>
          <p className="text-sm text-green-700">Track and resolve customer complaints</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900">Satisfaction Tracking</h3>
          <p className="text-sm text-purple-700">Monitor customer satisfaction metrics</p>
        </div>
      </div>
    </div>
  </div>
);

const ReportsAnalytics = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive reporting and business analytics</p>
      </div>
    </div>
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Reports & Analytics Module</h2>
      <p className="text-gray-600 mb-6">This module will provide comprehensive reporting and business analytics.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Service Reports</h3>
          <p className="text-sm text-blue-700">Service completion and performance reports</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900">Financial Analytics</h3>
          <p className="text-sm text-green-700">Revenue analysis and financial insights</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900">Customer Analytics</h3>
          <p className="text-sm text-purple-700">Customer behavior and satisfaction analysis</p>
        </div>
      </div>
    </div>
  </div>
);

// Main Application Component with Authentication
function VehicleServiceAppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AutoService Pro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handlePageChange} />;
      
      // Customer Interaction Flow (Call Center)
      case 'callcenter':
        return <CallCenterManagement onNavigate={handlePageChange} />;
      
      // Customer Management
      case 'customers':
        return <CustomerManagement onNavigate={handlePageChange} />;
      
      // Home Service Flow
      case 'homeservice':
        return <HomeServiceManagement onNavigate={handlePageChange} />;
      
      // Service Center Flow
      case 'servicecenter':
        return <ServiceCenterManagement onNavigate={handlePageChange} />;
      
      // Work Order Management
      case 'workorders':
        return <WorkOrderManagement onNavigate={handlePageChange} />;
      
      // Engineer Management
      case 'engineers':
        return <EngineerManagement onNavigate={handlePageChange} />;
      
      // Inventory Management
      case 'inventory':
        return <InventoryManagement onNavigate={handlePageChange} />;
      
      // Billing & Payment
      case 'billing':
        return <BillingManagement onNavigate={handlePageChange} />;
      
      // Feedback & Complaints
      case 'feedback':
        return <FeedbackManagement onNavigate={handlePageChange} />;
      
      // Reports & Analytics
      case 'reports':
        return <ReportsAnalytics onNavigate={handlePageChange} />;
      
      // Quick Actions
      case 'new-customer':
        return <CustomerManagement onNavigate={handlePageChange} />;
      case 'new-workorder':
        return <WorkOrderManagement onNavigate={handlePageChange} />;
      case 'new-homeservice':
        return <HomeServiceManagement onNavigate={handlePageChange} />;
      case 'service-checkin':
        return <ServiceCenterManagement onNavigate={handlePageChange} />;
      
      default:
        return <Dashboard onNavigate={handlePageChange} />;
    }
  };

  return (
    <VehicleServiceLayout 
      currentPage={currentPage} 
      onPageChange={handlePageChange}
    >
      {renderCurrentPage()}
    </VehicleServiceLayout>
  );
}

// Main Application Component following the flowchart workflow
export default function VehicleServiceApp() {
  return (
    <AuthProvider>
      <VehicleServiceAppContent />
    </AuthProvider>
  );
}
