"use client";

import React, { useState, useEffect } from 'react';
import { vehicleServiceAPI } from '../../services/api';
import { Customer, Vehicle, WorkOrder } from '../../types';

interface HomeServiceManagementProps {
  onNavigate: (page: string) => void;
}

interface HomeServiceBooking {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehicleInfo: string;
  serviceAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  scheduledDate: Date;
  estimatedDuration: number; // in hours
  services: string[];
  engineerId?: string;
  engineerName?: string;
  status: 'scheduled' | 'assigned' | 'en_route' | 'on_site' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  estimatedCost: number;
  actualCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function HomeServiceManagement({ onNavigate }: HomeServiceManagementProps) {
  const [bookings, setBookings] = useState<HomeServiceBooking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<HomeServiceBooking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newBooking, setNewBooking] = useState({
    customerId: '',
    vehicleId: '',
    serviceAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    scheduledDate: '',
    estimatedDuration: 2,
    services: [] as string[],
    notes: '',
    estimatedCost: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersResponse, vehiclesResponse] = await Promise.all([
        vehicleServiceAPI.getCustomers(),
        vehicleServiceAPI.getVehicles()
      ]);

      if (customersResponse.data) {
        setCustomers(customersResponse.data);
      }
      if (vehiclesResponse.data) {
        setVehicles(vehiclesResponse.data);
      }

      // Mock engineers data
      const mockEngineers = [
        { id: 'eng1', name: 'Mike Johnson', specialization: 'General Service', isAvailable: true },
        { id: 'eng2', name: 'Sarah Wilson', specialization: 'Brake Service', isAvailable: true },
        { id: 'eng3', name: 'David Brown', specialization: 'Engine Service', isAvailable: false }
      ];
      setEngineers(mockEngineers);

      // Mock home service bookings
      const mockBookings: HomeServiceBooking[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          vehicleId: '1',
          vehicleInfo: '2020 Honda Civic',
          serviceAddress: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          },
          scheduledDate: new Date('2024-01-25T10:00:00'),
          estimatedDuration: 2,
          services: ['Oil Change', 'Brake Inspection'],
          engineerId: 'eng1',
          engineerName: 'Mike Johnson',
          status: 'assigned',
          notes: 'Customer prefers morning service',
          estimatedCost: 150,
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Jane Smith',
          vehicleId: '2',
          vehicleInfo: '2019 Toyota Camry',
          serviceAddress: {
            street: '456 Oak Ave',
            city: 'Somewhere',
            state: 'NY',
            zipCode: '67890'
          },
          scheduledDate: new Date('2024-01-26T14:00:00'),
          estimatedDuration: 3,
          services: ['Engine Diagnostic', 'Transmission Service'],
          status: 'scheduled',
          notes: 'Customer has flexible schedule',
          estimatedCost: 300,
          createdAt: new Date('2024-01-21'),
          updatedAt: new Date('2024-01-21')
        }
      ];

      setBookings(mockBookings);
    } catch (error) {
      console.error('Failed to load home service data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const customer = customers.find(c => c.id === newBooking.customerId);
      const vehicle = vehicles.find(v => v.id === newBooking.vehicleId);
      
      const bookingData: HomeServiceBooking = {
        ...newBooking,
        id: Date.now().toString(),
        customerName: customer ? `${customer.firstName} ${customer.lastName}` : '',
        vehicleInfo: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : '',
        scheduledDate: new Date(newBooking.scheduledDate),
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setBookings([...bookings, bookingData]);
      setShowNewBookingForm(false);
      setNewBooking({
        customerId: '',
        vehicleId: '',
        serviceAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        scheduledDate: '',
        estimatedDuration: 2,
        services: [],
        notes: '',
        estimatedCost: 0
      });
      alert('Home service booking created successfully!');
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking');
    }
  };

  const handleAssignEngineer = (bookingId: string, engineerId: string) => {
    const engineer = engineers.find(e => e.id === engineerId);
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            engineerId, 
            engineerName: engineer?.name,
            status: 'assigned' as const,
            updatedAt: new Date()
          }
        : booking
    ));
    alert('Engineer assigned successfully!');
  };

  const handleStatusUpdate = (bookingId: string, newStatus: HomeServiceBooking['status']) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date() }
        : booking
    ));
    alert('Status updated successfully!');
  };

  const filteredBookings = bookings.filter(booking =>
    filterStatus === 'all' || booking.status === filterStatus
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Home Service Management</h1>
          <p className="text-gray-600">Manage home service bookings and engineer assignments</p>
        </div>
        <button 
          onClick={() => setShowNewBookingForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          New Home Service Booking
        </button>
      </div>

      {/* Home Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {bookings.filter(b => 
                  b.scheduledDate.toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {bookings.filter(b => b.status === 'in_progress').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Engineers</p>
              <p className="text-3xl font-bold text-gray-900">
                {engineers.filter(e => e.isAvailable).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-gray-900">
                {bookings.filter(b => 
                  b.status === 'completed' && 
                  b.updatedAt.toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              placeholder="Search bookings by customer name or vehicle..."
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
              <option value="scheduled">Scheduled</option>
              <option value="assigned">Assigned</option>
              <option value="en_route">En Route</option>
              <option value="on_site">On Site</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engineer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.vehicleInfo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.serviceAddress.street}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.serviceAddress.city}, {booking.serviceAddress.state} {booking.serviceAddress.zipCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.scheduledDate.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.scheduledDate.toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Est. {booking.estimatedDuration}h
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.engineerName ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.engineerName}</div>
                        <div className="text-sm text-gray-500">ID: {booking.engineerId}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'scheduled' ? 'bg-gray-100 text-gray-800' :
                      booking.status === 'en_route' ? 'bg-purple-100 text-purple-800' :
                      booking.status === 'on_site' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.services.join(', ')}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${booking.estimatedCost}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      {booking.status === 'scheduled' && (
                        <button 
                          onClick={() => {
                            const availableEngineer = engineers.find(e => e.isAvailable);
                            if (availableEngineer) {
                              handleAssignEngineer(booking.id, availableEngineer.id);
                            }
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Assign
                        </button>
                      )}
                      {booking.status === 'assigned' && (
                        <button 
                          onClick={() => handleStatusUpdate(booking.id, 'en_route')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Start Route
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

      {/* New Booking Form Modal */}
      {showNewBookingForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">New Home Service Booking</h3>
                <button 
                  onClick={() => setShowNewBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <select
                      required
                      value={newBooking.customerId}
                      onChange={(e) => setNewBooking({...newBooking, customerId: e.target.value})}
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
                      value={newBooking.vehicleId}
                      onChange={(e) => setNewBooking({...newBooking, vehicleId: e.target.value})}
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street Address"
                    value={newBooking.serviceAddress.street}
                    onChange={(e) => setNewBooking({
                      ...newBooking, 
                      serviceAddress: {...newBooking.serviceAddress, street: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newBooking.serviceAddress.city}
                      onChange={(e) => setNewBooking({
                        ...newBooking, 
                        serviceAddress: {...newBooking.serviceAddress, city: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newBooking.serviceAddress.state}
                      onChange={(e) => setNewBooking({
                        ...newBooking, 
                        serviceAddress: {...newBooking.serviceAddress, state: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="ZIP Code"
                      value={newBooking.serviceAddress.zipCode}
                      onChange={(e) => setNewBooking({
                        ...newBooking, 
                        serviceAddress: {...newBooking.serviceAddress, zipCode: e.target.value}
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newBooking.scheduledDate}
                      onChange={(e) => setNewBooking({...newBooking, scheduledDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (hours)</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={newBooking.estimatedDuration}
                      onChange={(e) => setNewBooking({...newBooking, estimatedDuration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services Required</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Oil Change', 'Brake Inspection', 'Engine Diagnostic', 'Transmission Service', 'Tire Rotation', 'Battery Check'].map(service => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newBooking.services.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewBooking({...newBooking, services: [...newBooking.services, service]});
                            } else {
                              setNewBooking({...newBooking, services: newBooking.services.filter(s => s !== service)});
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newBooking.estimatedCost}
                    onChange={(e) => setNewBooking({...newBooking, estimatedCost: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    rows={3}
                    value={newBooking.notes}
                    onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter any special instructions or notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewBookingForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Booking
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
