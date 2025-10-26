"use client";

import React, { useState, useEffect } from 'react';
import { vehicleServiceAPI } from '../../services/api';
import { WorkOrder, WorkOrderStatus, Customer, Vehicle } from '../../types';

interface WorkOrderManagementProps {
  onNavigate: (page: string) => void;
}

export default function WorkOrderManagement({ onNavigate }: WorkOrderManagementProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [showNewWorkOrderForm, setShowNewWorkOrderForm] = useState(false);
  const [newWorkOrder, setNewWorkOrder] = useState({
    customerId: '',
    vehicleId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    estimatedCompletion: '',
    services: [] as any[],
    parts: [] as any[],
    laborHours: 0,
    laborRate: 85,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workOrdersResponse, customersResponse, vehiclesResponse] = await Promise.all([
        vehicleServiceAPI.getWorkOrders(),
        vehicleServiceAPI.getCustomers(),
        vehicleServiceAPI.getVehicles()
      ]);

      if (workOrdersResponse.data) {
        setWorkOrders(workOrdersResponse.data);
      }
      if (customersResponse.data) {
        setCustomers(customersResponse.data);
      }
      if (vehiclesResponse.data) {
        setVehicles(vehiclesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const workOrderData = {
        ...newWorkOrder,
        estimatedCompletion: new Date(newWorkOrder.estimatedCompletion),
        createdBy: 'current-user-id',
        status: WorkOrderStatus.PENDING,
        partsTotal: newWorkOrder.parts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0),
        laborTotal: newWorkOrder.laborHours * newWorkOrder.laborRate,
        taxRate: 0.08, // 8% tax rate
        taxAmount: 0, // Will be calculated
        totalAmount: 0 // Will be calculated
      };
      
      // Calculate totals
      workOrderData.taxAmount = (workOrderData.partsTotal + workOrderData.laborTotal) * workOrderData.taxRate;
      workOrderData.totalAmount = workOrderData.partsTotal + workOrderData.laborTotal + workOrderData.taxAmount;
      
      const response = await vehicleServiceAPI.createWorkOrder(workOrderData);
      if (response.success) {
        setShowNewWorkOrderForm(false);
        setNewWorkOrder({
          customerId: '',
          vehicleId: '',
          priority: 'medium',
          estimatedCompletion: '',
          services: [],
          parts: [],
          laborHours: 0,
          laborRate: 85,
          notes: ''
        });
        loadData();
        alert('Work order created successfully!');
      }
    } catch (error) {
      console.error('Failed to create work order:', error);
      alert('Failed to create work order');
    }
  };

  const handleStatusUpdate = async (workOrderId: string, newStatus: WorkOrderStatus) => {
    try {
      const response = await vehicleServiceAPI.updateWorkOrderStatus(workOrderId, newStatus);
      if (response.success) {
        loadData();
        alert('Work order status updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update work order status:', error);
      alert('Failed to update work order status');
    }
  };

  const filteredWorkOrders = workOrders.filter(workOrder =>
    statusFilter === 'all' || workOrder.status === statusFilter
  );

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Order Management</h1>
          <p className="text-gray-600">Manage service work orders and track progress</p>
        </div>
        <button 
          onClick={() => setShowNewWorkOrderForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Work Order
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search work orders..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as WorkOrderStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_parts">Waiting Parts</option>
              <option value="waiting_customer">Waiting Customer</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Work Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkOrders.map((workOrder) => (
                <tr key={workOrder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{workOrder.workOrderNumber}</div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(workOrder.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getCustomerName(workOrder.customerId)}</div>
                    <div className="text-sm text-gray-500">ID: {workOrder.customerId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getVehicleInfo(workOrder.vehicleId)}</div>
                    <div className="text-sm text-gray-500">VIN: {vehicles.find(v => v.id === workOrder.vehicleId)?.vin}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      workOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                      workOrder.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      workOrder.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                      workOrder.status === 'waiting_parts' ? 'bg-orange-100 text-orange-800' :
                      workOrder.status === 'waiting_customer' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {workOrder.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      workOrder.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      workOrder.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      workOrder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {workOrder.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${workOrder.totalAmount}</div>
                    <div className="text-sm text-gray-500">{workOrder.laborHours}h labor</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => onNavigate(`workorder-detail-${workOrder.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => onNavigate(`workorder-edit-${workOrder.id}`)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Edit
                      </button>
                      {workOrder.status !== WorkOrderStatus.COMPLETED && (
                        <button 
                          onClick={() => handleStatusUpdate(workOrder.id, WorkOrderStatus.COMPLETED)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Work Order Modal */}
      {showNewWorkOrderForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Work Order</h3>
                <button 
                  onClick={() => setShowNewWorkOrderForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateWorkOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <select
                      required
                      value={newWorkOrder.customerId}
                      onChange={(e) => setNewWorkOrder({...newWorkOrder, customerId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.firstName} {customer.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                    <select
                      required
                      value={newWorkOrder.vehicleId}
                      onChange={(e) => setNewWorkOrder({...newWorkOrder, vehicleId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newWorkOrder.priority}
                      onChange={(e) => setNewWorkOrder({...newWorkOrder, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Completion</label>
                    <input
                      type="datetime-local"
                      required
                      value={newWorkOrder.estimatedCompletion}
                      onChange={(e) => setNewWorkOrder({...newWorkOrder, estimatedCompletion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Labor Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={newWorkOrder.laborHours}
                      onChange={(e) => setNewWorkOrder({...newWorkOrder, laborHours: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Labor Rate ($/hour)</label>
                    <input
                      type="number"
                      min="0"
                      value={newWorkOrder.laborRate}
                      onChange={(e) => setNewWorkOrder({...newWorkOrder, laborRate: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={newWorkOrder.notes}
                    onChange={(e) => setNewWorkOrder({...newWorkOrder, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter work order notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewWorkOrderForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Work Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
