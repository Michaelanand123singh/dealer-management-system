// Service Layer for Vehicle Service Management System

import { 
  Customer, 
  Vehicle, 
  WorkOrder, 
  InventoryItem, 
  Invoice, 
  Payment,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  WorkOrderStatus,
  ServiceCategory,
  PartCategory
} from '../types';

// Mock Data Service - In production, this would connect to a real API
class VehicleServiceAPI {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  // Customer Management
  async getCustomers(page = 1, limit = 10): Promise<PaginatedResponse<Customer>> {
    // Mock implementation
    const mockCustomers: Customer[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345'
        },
        customerType: 'individual',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0124',
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zipCode: '67890'
        },
        customerType: 'fleet',
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ];

    return {
      data: mockCustomers,
      total: mockCustomers.length,
      page,
      limit,
      totalPages: Math.ceil(mockCustomers.length / limit)
    };
  }

  async getCustomer(id: string): Promise<ApiResponse<Customer>> {
    // Mock implementation
    const customer: Customer = {
      id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345'
      },
      customerType: 'individual',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    };

    return { success: true, data: customer };
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Customer>> {
    // Mock implementation
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return { success: true, data: newCustomer, message: 'Customer created successfully' };
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    // Mock implementation
    return { success: true, message: 'Customer updated successfully' };
  }

  // Vehicle Management
  async getVehicles(customerId?: string): Promise<ApiResponse<Vehicle[]>> {
    // Mock implementation
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        customerId: '1',
        vin: '1HGBH41JXMN109186',
        make: 'Honda',
        model: 'Civic',
        year: 2020,
        color: 'Silver',
        licensePlate: 'ABC123',
        mileage: 45000,
        engineType: '1.5L Turbo',
        transmission: 'cvt',
        fuelType: 'gasoline',
        vehicleType: 'car',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    return { success: true, data: mockVehicles };
  }

  async createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Vehicle>> {
    // Mock implementation
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return { success: true, data: newVehicle, message: 'Vehicle added successfully' };
  }

  // Work Order Management
  async getWorkOrders(status?: WorkOrderStatus): Promise<ApiResponse<WorkOrder[]>> {
    // Mock implementation
    const mockWorkOrders: WorkOrder[] = [
      {
        id: '1',
        customerId: '1',
        vehicleId: '1',
        workOrderNumber: 'WO-2024-001',
        status: WorkOrderStatus.IN_PROGRESS,
        priority: 'high',
        estimatedCompletion: new Date('2024-01-25'),
        services: [],
        parts: [],
        laborHours: 2.5,
        laborRate: 85,
        partsTotal: 150,
        laborTotal: 212.5,
        taxRate: 0.08,
        taxAmount: 29,
        totalAmount: 391.5,
        notes: 'Oil change and brake inspection',
        technicianId: 'tech1',
        createdBy: 'user1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ];

    return { success: true, data: mockWorkOrders };
  }

  async createWorkOrder(workOrder: Omit<WorkOrder, 'id' | 'workOrderNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<WorkOrder>> {
    // Mock implementation
    const newWorkOrder: WorkOrder = {
      ...workOrder,
      id: Date.now().toString(),
      workOrderNumber: `WO-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return { success: true, data: newWorkOrder, message: 'Work order created successfully' };
  }

  async updateWorkOrderStatus(id: string, status: WorkOrderStatus): Promise<ApiResponse<WorkOrder>> {
    // Mock implementation
    return { success: true, message: 'Work order status updated successfully' };
  }

  // Inventory Management
  async getInventoryItems(): Promise<ApiResponse<InventoryItem[]>> {
    // Mock implementation
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        partNumber: 'FIL-001',
        name: 'Engine Oil Filter',
        description: 'High-quality engine oil filter for most vehicles',
        category: PartCategory.FILTERS,
        currentStock: 25,
        minimumStock: 10,
        maximumStock: 100,
        unitPrice: 12.99,
        supplier: 'AutoParts Inc',
        location: 'A-15',
        binNumber: 'A15-001',
        lastRestocked: new Date('2024-01-10'),
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        partNumber: 'BRK-002',
        name: 'Brake Pads Set',
        description: 'Ceramic brake pads for front wheels',
        category: PartCategory.BRAKES,
        currentStock: 8,
        minimumStock: 15,
        maximumStock: 50,
        unitPrice: 89.99,
        supplier: 'BrakeTech',
        location: 'B-22',
        binNumber: 'B22-002',
        lastRestocked: new Date('2024-01-05'),
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    return { success: true, data: mockInventory };
  }

  async updateInventoryStock(id: string, quantity: number): Promise<ApiResponse<InventoryItem>> {
    // Mock implementation
    return { success: true, message: 'Inventory updated successfully' };
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    // Mock implementation
    const stats: DashboardStats = {
      totalCustomers: 156,
      activeWorkOrders: 12,
      completedWorkOrders: 89,
      pendingWorkOrders: 8,
      totalRevenue: 125000,
      monthlyRevenue: 18500,
      averageJobTime: 2.5,
      customerSatisfaction: 4.7,
      inventoryValue: 45000,
      lowStockItems: 5,
      techniciansOnDuty: 4,
      vehiclesInService: 12
    };

    return { success: true, data: stats };
  }

  // Invoice Management
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    // Mock implementation
    return { success: true, data: [] };
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Invoice>> {
    // Mock implementation
    return { success: true, message: 'Invoice created successfully' };
  }

  // Payment Management
  async processPayment(payment: Omit<Payment, 'id' | 'createdAt'>): Promise<ApiResponse<Payment>> {
    // Mock implementation
    return { success: true, message: 'Payment processed successfully' };
  }
}

export const vehicleServiceAPI = new VehicleServiceAPI();
