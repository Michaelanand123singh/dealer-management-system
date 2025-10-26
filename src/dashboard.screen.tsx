"use client";

import { useState, useEffect } from "react";

// Dynamic section configuration
interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  component: () => React.ReactElement;
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard-active-section') || "home";
    }
    return "home";
  });
  
  const [dashboardStats, setDashboardStats] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-stats');
      return saved ? JSON.parse(saved) : {
        totalJobCards: 24,
        activeJobs: 8,
        completedJobs: 16,
        inventoryItems: 156,
        pendingServices: 3,
        totalRevenue: 45600
      };
    }
    return {
      totalJobCards: 24,
      activeJobs: 8,
      completedJobs: 16,
      inventoryItems: 156,
      pendingServices: 3,
      totalRevenue: 45600
    };
  });

  // Save active section to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-active-section', activeSection);
    }
  }, [activeSection]);

  // Save dashboard stats to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-stats', JSON.stringify(dashboardStats));
    }
  }, [dashboardStats]);

  // Dynamic functions for interactive features
  const handleUpdateInventory = (itemId: string, newQuantity: number) => {
    // Simulate inventory update
    setDashboardStats((prev: typeof dashboardStats) => ({
      ...prev,
      inventoryItems: prev.inventoryItems + (newQuantity > 0 ? 1 : -1)
    }));
    alert(`Inventory updated for item ${itemId}`);
  };

  const handleCompleteJob = (jobId: string) => {
    // Simulate job completion
    setDashboardStats((prev: typeof dashboardStats) => ({
      ...prev,
      activeJobs: prev.activeJobs - 1,
      completedJobs: prev.completedJobs + 1,
      totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 500) + 200
    }));
    alert(`Job ${jobId} marked as completed!`);
  };

  const handleCustomerOnboarding = (formData: any) => {
    // Simulate customer onboarding
    setDashboardStats((prev: typeof dashboardStats) => ({
      ...prev,
      totalJobCards: prev.totalJobCards + 1,
      activeJobs: prev.activeJobs + 1
    }));
    alert('Customer onboarded successfully! You can now create a job card for them.');
    setActiveSection('jobcardlist');
  };

  // Mock data for dynamic content
  const [recentActivities] = useState([
    { id: 1, type: "job_card", message: "New job card created for Vehicle #VH001", time: "2 minutes ago", status: "success" },
    { id: 2, type: "inventory", message: "Oil filter stock updated", time: "15 minutes ago", status: "info" },
    { id: 3, type: "service", message: "Service completed for Customer John Doe", time: "1 hour ago", status: "success" },
    { id: 4, type: "payment", message: "Payment received for Invoice #INV-2024-001", time: "2 hours ago", status: "success" }
  ]);

  const [jobCards] = useState([
    { id: "JC001", vehicleId: "VH001", customer: "John Doe", service: "Oil Change", status: "In Progress", priority: "High" },
    { id: "JC002", vehicleId: "VH002", customer: "Jane Smith", service: "Brake Service", status: "Pending", priority: "Medium" },
    { id: "JC003", vehicleId: "VH003", customer: "Bob Johnson", service: "Tire Rotation", status: "Completed", priority: "Low" }
  ]);

  const [inventoryItems] = useState([
    { id: "INV001", name: "Engine Oil 5W-30", quantity: 25, minThreshold: 10, category: "Fluids" },
    { id: "INV002", name: "Oil Filter", quantity: 8, minThreshold: 15, category: "Filters" },
    { id: "INV003", name: "Brake Pads", quantity: 12, minThreshold: 5, category: "Brake Parts" },
    { id: "INV004", name: "Air Filter", quantity: 3, minThreshold: 8, category: "Filters" }
  ]);

  // Dynamic section components
  const sectionComponents: Record<string, () => React.ReactElement> = {
    home: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
          <div>
                <p className="text-sm font-medium text-gray-600">Total Job Cards</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalJobCards}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
          <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeJobs}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
          <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${dashboardStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveSection("customer")}
                className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <svg className="w-8 h-8 text-indigo-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm font-medium text-indigo-900">Customer</p>
              </button>
              <button 
                onClick={() => setActiveSection("inventory")}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm font-medium text-green-900">Inventory</p>
              </button>
              <button 
                onClick={() => setActiveSection("reports")}
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium text-purple-900">Reports</p>
              </button>
              <button 
                onClick={() => setActiveSection("jobcardlist")}
                className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <svg className="w-8 h-8 text-orange-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-medium text-orange-900">Job Cards</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    ),

    jobcardlist: () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-600">Job Card Management</h2>
          <button 
            onClick={() => setActiveSection("jobcard")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create New Job Card
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Card ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobCards.map((jobCard) => (
                  <tr key={jobCard.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{jobCard.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{jobCard.vehicleId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{jobCard.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{jobCard.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        jobCard.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        jobCard.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {jobCard.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        jobCard.priority === 'High' ? 'bg-red-100 text-red-800' :
                        jobCard.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {jobCard.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      {jobCard.status !== 'Completed' && (
            <button
                          onClick={() => handleCompleteJob(jobCard.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Complete
            </button>
                      )}
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),

    customer: () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-600">Customer Onboarding</h2>
          <div className="flex space-x-3">
             <button
              onClick={() => setActiveSection("jobcardlist")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Job Card
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form 
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = Object.fromEntries(formData);
              handleCustomerOnboarding(data);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                <input 
                  type="text" 
                  name="vehicleModel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter vehicle model"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Needed</label>
                <select 
                  name="serviceNeeded"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a service</option>
                  <option value="oil_change">Oil Change</option>
                  <option value="tire_rotation">Tire Rotation</option>
                  <option value="brake_service">Brake Service</option>
                  <option value="engine_diagnosis">Engine Diagnosis</option>
                  <option value="transmission_service">Transmission Service</option>
                  <option value="air_conditioning">Air Conditioning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Year</label>
                <input 
                  type="number" 
                  name="vehicleYear"
                  min="1990"
                  max="2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter vehicle year"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea 
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Any additional information about the customer or vehicle..."
              />
            </div>
            <div className="flex justify-end space-x-3">
            <button
                type="button" 
                onClick={() => setActiveSection('home')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Onboard Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    ),

    inventory: () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-600">Inventory Management</h2>
          <div className="flex space-x-3">
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Add Item
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.category}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Stock:</span>
                  <span className={`text-sm font-medium ${item.quantity <= item.minThreshold ? 'text-red-600' : 'text-green-600'}`}>
                    {item.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Min Threshold:</span>
                  <span className="text-sm text-gray-900">{item.minThreshold}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.quantity <= item.minThreshold ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min((item.quantity / (item.minThreshold * 2)) * 100, 100)}%` }}
                  ></div>
                </div>
                {item.quantity <= item.minThreshold && (
                  <p className="text-xs text-red-600 font-medium">Low Stock Alert!</p>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
            <button
                  onClick={() => handleUpdateInventory(item.id, item.quantity + 10)}
                  className="flex-1 bg-indigo-50 text-indigo-700 py-2 px-3 rounded text-sm hover:bg-indigo-100"
                >
                  Update
            </button>
            <button
                  onClick={() => handleUpdateInventory(item.id, item.minThreshold + 5)}
                  className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded text-sm hover:bg-green-100"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    reports: () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-600">Reports & Analytics</h2>
          <div className="flex space-x-3">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Services Completed</span>
                <span className="text-2xl font-bold text-green-600">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Service Time</span>
                <span className="text-2xl font-bold text-blue-600">2.5 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-2xl font-bold text-purple-600">4.8/5</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="text-2xl font-bold text-green-600">$45,600</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="text-2xl font-bold text-blue-600">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Ticket</span>
                <span className="text-2xl font-bold text-purple-600">$292</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
          <div className="space-y-3">
            {[
              { service: "Oil Change", count: 45, revenue: 13500 },
              { service: "Brake Service", count: 32, revenue: 19200 },
              { service: "Tire Rotation", count: 28, revenue: 8400 },
              { service: "Engine Diagnosis", count: 15, revenue: 4500 }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.service}</span>
                <div className="flex space-x-4">
                  <span className="text-sm text-gray-600">{item.count} services</span>
                  <span className="text-sm font-medium text-green-600">${item.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  };

  const renderContent = () => {
    const Component = sectionComponents[activeSection] || sectionComponents.home;
    return Component();
  };

  // Dynamic navigation configuration
  const navigationItems = [
    { id: "home", label: "Dashboard", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" },
    { id: "jobcardlist", label: "Job Cards", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "customer", label: "Customer Onboarding", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "inventory", label: "Inventory", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { id: "reports", label: "Reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-indigo-600">ServiceHub</h2>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@servicehub.com</p>
            </div>
          </div>
          
          <button
            className="w-full flex items-center px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
            onClick={() => alert("Logout clicked!")}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
