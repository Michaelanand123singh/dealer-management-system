"use client";

import React, { useState, useEffect } from 'react';
import { vehicleServiceAPI } from '../../services/api';
import { Customer, WorkOrder } from '../../types';

interface CallCenterManagementProps {
  onNavigate: (page: string) => void;
}

interface CallRecord {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  callType: 'inquiry' | 'booking' | 'complaint' | 'followup';
  serviceType: 'home_service' | 'service_center';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in_progress' | 'resolved' | 'escalated';
  notes: string;
  estimatedCost?: number;
  scheduledDate?: Date;
  advisorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CallCenterManagement({ onNavigate }: CallCenterManagementProps) {
  const [callRecords, setCallRecords] = useState<CallRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewCallForm, setShowNewCallForm] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const [newCall, setNewCall] = useState({
    customerId: '',
    callType: 'inquiry' as 'inquiry' | 'booking' | 'complaint' | 'followup',
    serviceType: 'service_center' as 'home_service' | 'service_center',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    notes: '',
    estimatedCost: 0,
    scheduledDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const customersResponse = await vehicleServiceAPI.getCustomers();
      if (customersResponse.data) {
        setCustomers(customersResponse.data);
      }
      
      // Mock call records data
      const mockCallRecords: CallRecord[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          phone: '+1-555-0123',
          callType: 'booking',
          serviceType: 'home_service',
          priority: 'high',
          status: 'in_progress',
          notes: 'Customer requesting home service for oil change and brake inspection',
          estimatedCost: 150,
          scheduledDate: new Date('2024-01-25'),
          advisorId: 'advisor1',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Jane Smith',
          phone: '+1-555-0124',
          callType: 'complaint',
          serviceType: 'service_center',
          priority: 'urgent',
          status: 'escalated',
          notes: 'Customer complaint about delayed service completion',
          advisorId: 'advisor2',
          createdAt: new Date('2024-01-19'),
          updatedAt: new Date('2024-01-20')
        }
      ];
      
      setCallRecords(mockCallRecords);
    } catch (error) {
      console.error('Failed to load call center data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const callData: CallRecord = {
        ...newCall,
        id: Date.now().toString(),
        customerName: customers.find(c => c.id === newCall.customerId)?.firstName + ' ' + customers.find(c => c.id === newCall.customerId)?.lastName || '',
        phone: customers.find(c => c.id === newCall.customerId)?.phone || '',
        status: 'new',
        advisorId: 'current-advisor',
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledDate: newCall.scheduledDate ? new Date(newCall.scheduledDate) : undefined
      };
      
      setCallRecords([...callRecords, callData]);
      setShowNewCallForm(false);
      setNewCall({
        customerId: '',
        callType: 'inquiry',
        serviceType: 'service_center',
        priority: 'medium',
        notes: '',
        estimatedCost: 0,
        scheduledDate: ''
      });
      alert('Call record created successfully!');
    } catch (error) {
      console.error('Failed to create call record:', error);
      alert('Failed to create call record');
    }
  };

  const handleScheduleService = (callId: string) => {
    const call = callRecords.find(c => c.id === callId);
    if (call) {
      if (call.serviceType === 'home_service') {
        onNavigate('homeservice');
      } else {
        onNavigate('servicecenter');
      }
    }
  };

  const filteredCalls = callRecords.filter(call => {
    const statusMatch = filterStatus === 'all' || call.status === filterStatus;
    const typeMatch = filterType === 'all' || call.callType === filterType;
    return statusMatch && typeMatch;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Call Center Management</h1>
          <p className="text-gray-600">Manage customer calls, bookings, and service scheduling</p>
        </div>
        <button 
          onClick={() => setShowNewCallForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          New Call Record
        </button>
      </div>

      {/* Call Center Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Calls</p>
              <p className="text-3xl font-bold text-gray-900">
                {callRecords.filter(c => c.status === 'in_progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bookings Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {callRecords.filter(c => c.callType === 'booking' && c.status === 'resolved').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Complaints</p>
              <p className="text-3xl font-bold text-gray-900">
                {callRecords.filter(c => c.callType === 'complaint').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Escalated</p>
              <p className="text-3xl font-bold text-gray-900">
                {callRecords.filter(c => c.status === 'escalated').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search calls by customer name or phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="inquiry">Inquiry</option>
              <option value="booking">Booking</option>
              <option value="complaint">Complaint</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>
        </div>
      </div>

      {/* Call Records List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Call Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCalls.map((call) => (
                <tr key={call.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{call.customerName}</div>
                      <div className="text-sm text-gray-500">{call.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      call.callType === 'booking' ? 'bg-green-100 text-green-800' :
                      call.callType === 'complaint' ? 'bg-red-100 text-red-800' :
                      call.callType === 'inquiry' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {call.callType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      call.serviceType === 'home_service' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {call.serviceType === 'home_service' ? 'Home Service' : 'Service Center'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      call.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      call.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      call.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {call.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      call.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      call.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      call.status === 'escalated' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {call.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {call.scheduledDate ? new Date(call.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                    </div>
                    {call.estimatedCost && (
                      <div className="text-sm text-gray-500">Est: ${call.estimatedCost}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedCall(call)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      {call.callType === 'booking' && call.status === 'resolved' && (
                        <button 
                          onClick={() => handleScheduleService(call.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Schedule
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

      {/* New Call Form Modal */}
      {showNewCallForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">New Call Record</h3>
                <button 
                  onClick={() => setShowNewCallForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateCall} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    required
                    value={newCall.customerId}
                    onChange={(e) => setNewCall({...newCall, customerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Call Type</label>
                    <select
                      value={newCall.callType}
                      onChange={(e) => setNewCall({...newCall, callType: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="inquiry">Inquiry</option>
                      <option value="booking">Booking</option>
                      <option value="complaint">Complaint</option>
                      <option value="followup">Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                    <select
                      value={newCall.serviceType}
                      onChange={(e) => setNewCall({...newCall, serviceType: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="service_center">Service Center</option>
                      <option value="home_service">Home Service</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newCall.priority}
                    onChange={(e) => setNewCall({...newCall, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    min="0"
                    value={newCall.estimatedCost}
                    onChange={(e) => setNewCall({...newCall, estimatedCost: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={newCall.scheduledDate}
                    onChange={(e) => setNewCall({...newCall, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={newCall.notes}
                    onChange={(e) => setNewCall({...newCall, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter call notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewCallForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Call Record
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
