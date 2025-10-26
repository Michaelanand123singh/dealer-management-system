"use client";

import React, { useState, useEffect } from 'react';
import { vehicleServiceAPI } from '../../services/api';
import { Customer, Vehicle, WorkOrder, WorkOrderStatus } from '../../types';

interface ServiceCenterManagementProps {
  onNavigate: (page: string) => void;
}

interface CheckInData {
  customerId: string;
  vehicleId: string;
  serviceType: string;
  description: string;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  advisorNotes: string;
}

export default function ServiceCenterManagement({ onNavigate }: ServiceCenterManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showEstimationForm, setShowEstimationForm] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInData, setCheckInData] = useState<CheckInData>({
    customerId: '',
    vehicleId: '',
    serviceType: '',
    description: '',
    estimatedDuration: 0,
    priority: 'medium',
    advisorNotes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersResponse, vehiclesResponse, workOrdersResponse] = await Promise.all([
        vehicleServiceAPI.getCustomers(),
        vehicleServiceAPI.getVehicles(),
        vehicleServiceAPI.getWorkOrders()
      ]);

      if (customersResponse.data) setCustomers(customersResponse.data);
      if (vehiclesResponse.data) setVehicles(vehiclesResponse.data);
      if (workOrdersResponse.data) setWorkOrders(workOrdersResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const workOrderData = {
        ...checkInData,
        status: WorkOrderStatus.PENDING,
        estimatedCompletion: new Date(Date.now() + checkInData.estimatedDuration * 60 * 60 * 1000),
        createdBy: 'current-user-id',
        partsTotal: 0,
        laborTotal: checkInData.estimatedDuration * 75, // $75/hour
        taxRate: 0.08,
        taxAmount: 0,
        totalAmount: 0,
        services: [],
        parts: [],
        laborHours: checkInData.estimatedDuration,
        laborRate: 75,
        notes: checkInData.description
      };

      workOrderData.taxAmount = workOrderData.laborTotal * workOrderData.taxRate;
      workOrderData.totalAmount = workOrderData.laborTotal + workOrderData.taxAmount;

      const response = await vehicleServiceAPI.createWorkOrder(workOrderData);
      if (response.success) {
        alert('Vehicle checked in successfully!');
        setShowCheckInForm(false);
        setCheckInData({
          customerId: '',
          vehicleId: '',
          serviceType: '',
          description: '',
          estimatedDuration: 0,
          priority: 'medium',
          advisorNotes: ''
        });
        loadData();
      }
    } catch (error) {
      console.error('Failed to check in vehicle:', error);
      alert('Failed to check in vehicle. Please try again.');
    }
  };

  const handleStatusUpdate = async (workOrderId: string, status: WorkOrderStatus) => {
    try {
      const response = await vehicleServiceAPI.updateWorkOrderStatus(workOrderId, status);
      if (response.success) {
        alert(`Work order status updated to ${status}`);
        loadData();
      }
    } catch (error) {
      console.error('Failed to update work order status:', error);
    }
  };

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case WorkOrderStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case WorkOrderStatus.WAITING_PARTS:
        return 'bg-yellow-100 text-yellow-800';
      case WorkOrderStatus.WAITING_CUSTOMER:
        return 'bg-orange-100 text-orange-800';
      case WorkOrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Center Management</h1>
          <p className="text-gray-600">Vehicle check-in, estimation, and service operations</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCheckInForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Check In Vehicle
          </button>
          <button
            onClick={() => onNavigate('workorders')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View All Work Orders
          </button>
        </div>
      </div>

      {/* Service Center Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicles in Service</p>
              <p className="text-3xl font-bold text-gray-900">
                {workOrders.filter(wo => wo.status === WorkOrderStatus.IN_PROGRESS).length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {workOrders.filter(wo => 
                  wo.status === WorkOrderStatus.COMPLETED && 
                  new Date(wo.actualCompletion || '').toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Waiting for Parts</p>
              <p className="text-3xl font-bold text-gray-900">
                {workOrders.filter(wo => wo.status === WorkOrderStatus.WAITING_PARTS).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Services</p>
              <p className="text-3xl font-bold text-gray-900">
                {workOrders.filter(wo => 
                  wo.status !== WorkOrderStatus.COMPLETED && 
                  wo.status !== WorkOrderStatus.CANCELLED &&
                  new Date(wo.estimatedCompletion) < new Date()
                ).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Check-In Form */}
      {showCheckInForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Vehicle Check-In</h2>
          <form onSubmit={handleCheckIn} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                <select
                  value={checkInData.customerId}
                  onChange={(e) => setCheckInData({ ...checkInData, customerId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                <select
                  value={checkInData.vehicleId}
                  onChange={(e) => setCheckInData({ ...checkInData, vehicleId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles
                    .filter(v => v.customerId === checkInData.customerId)
                    .map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select
                  value={checkInData.serviceType}
                  onChange={(e) => setCheckInData({ ...checkInData, serviceType: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Service</option>
                  <option value="oil_change">Oil Change</option>
                  <option value="brake_service">Brake Service</option>
                  <option value="tire_rotation">Tire Rotation</option>
                  <option value="engine_diagnosis">Engine Diagnosis</option>
                  <option value="transmission_service">Transmission Service</option>
                  <option value="air_conditioning">Air Conditioning</option>
                  <option value="general_inspection">General Inspection</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={checkInData.priority}
                  onChange={(e) => setCheckInData({ ...checkInData, priority: e.target.value as any })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (hours)</label>
                <input
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={checkInData.estimatedDuration}
                  onChange={(e) => setCheckInData({ ...checkInData, estimatedDuration: parseFloat(e.target.value) })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
              <textarea
                value={checkInData.description}
                onChange={(e) => setCheckInData({ ...checkInData, description: e.target.value })}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe the service needed..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Advisor Notes</label>
              <textarea
                value={checkInData.advisorNotes}
                onChange={(e) => setCheckInData({ ...checkInData, advisorNotes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Additional notes or observations..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCheckInForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Check In Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Work Orders */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Active Work Orders</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              All ({workOrders.length})
            </button>
            <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              In Progress ({workOrders.filter(wo => wo.status === WorkOrderStatus.IN_PROGRESS).length})
            </button>
            <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Waiting Parts ({workOrders.filter(wo => wo.status === WorkOrderStatus.WAITING_PARTS).length})
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workOrders
                .filter(wo => wo.status !== WorkOrderStatus.COMPLETED && wo.status !== WorkOrderStatus.CANCELLED)
                .map((workOrder) => (
                <tr key={workOrder.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {workOrder.workOrderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customers.find(c => c.id === workOrder.customerId)?.firstName} {customers.find(c => c.id === workOrder.customerId)?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicles.find(v => v.id === workOrder.vehicleId)?.year} {vehicles.find(v => v.id === workOrder.vehicleId)?.make} {vehicles.find(v => v.id === workOrder.vehicleId)?.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workOrder.services.length > 0 ? workOrder.services[0].name : 'General Service'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(workOrder.priority)}`}>
                      {workOrder.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workOrder.status)}`}>
                      {workOrder.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(workOrder.estimatedCompletion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {workOrder.status === WorkOrderStatus.PENDING && (
                        <button
                          onClick={() => handleStatusUpdate(workOrder.id, WorkOrderStatus.IN_PROGRESS)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Start
                        </button>
                      )}
                      {workOrder.status === WorkOrderStatus.IN_PROGRESS && (
                        <button
                          onClick={() => handleStatusUpdate(workOrder.id, WorkOrderStatus.COMPLETED)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => onNavigate(`workorder-edit-${workOrder.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
