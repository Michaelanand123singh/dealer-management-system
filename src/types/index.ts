// Core Types for Vehicle Service Management System

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'receptionist';
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dateOfBirth?: Date;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  customerType: 'individual' | 'fleet' | 'commercial';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  customerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage: number;
  engineType: string;
  transmission: 'manual' | 'automatic' | 'cvt';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  vehicleType: 'car' | 'truck' | 'suv' | 'motorcycle' | 'commercial';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceHistory {
  id: string;
  vehicleId: string;
  workOrderId: string;
  serviceDate: Date;
  mileage: number;
  services: ServiceItem[];
  parts: PartItem[];
  laborHours: number;
  totalCost: number;
  notes: string;
  technicianId: string;
  createdAt: Date;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  laborHours: number;
  laborRate: number;
  isActive: boolean;
}

export interface PartItem {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: PartCategory;
  quantity: number;
  unitPrice: number;
  supplier: string;
  warrantyPeriod: number; // in months
  isActive: boolean;
}

export interface WorkOrder {
  id: string;
  customerId: string;
  vehicleId: string;
  workOrderNumber: string;
  status: WorkOrderStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCompletion: Date;
  actualCompletion?: Date;
  services: ServiceItem[];
  parts: PartItem[];
  laborHours: number;
  laborRate: number;
  partsTotal: number;
  laborTotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  notes: string;
  technicianId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  category: PartCategory;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  binNumber?: string;
  lastRestocked: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  customerId: string;
  vehicleId: string;
  invoiceDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentTerms: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'check' | 'bank_transfer';
  paymentDate: Date;
  referenceNumber?: string;
  notes?: string;
  processedBy: string;
  createdAt: Date;
}

// Enums
export enum ServiceCategory {
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  DIAGNOSTIC = 'diagnostic',
  INSPECTION = 'inspection',
  WARRANTY = 'warranty',
  RECALL = 'recall'
}

export enum PartCategory {
  ENGINE = 'engine',
  TRANSMISSION = 'transmission',
  BRAKES = 'brakes',
  SUSPENSION = 'suspension',
  ELECTRICAL = 'electrical',
  HVAC = 'hvac',
  BODY = 'body',
  INTERIOR = 'interior',
  FILTERS = 'filters',
  FLUIDS = 'fluids',
  TIRES = 'tires',
  BATTERY = 'battery'
}

export enum WorkOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  WAITING_CUSTOMER = 'waiting_customer',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Dashboard Statistics
export interface DashboardStats {
  totalCustomers: number;
  activeWorkOrders: number;
  completedWorkOrders: number;
  pendingWorkOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageJobTime: number;
  customerSatisfaction: number;
  inventoryValue: number;
  lowStockItems: number;
  techniciansOnDuty: number;
  vehiclesInService: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
