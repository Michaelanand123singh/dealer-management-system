"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'advisor' | 'engineer' | 'receptionist';
  permissions: string[];
  avatar?: string;
  lastLogin?: Date;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@autoservice.com',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    permissions: ['*'], // Admin has all permissions
    avatar: '/avatars/admin.jpg',
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: '2',
    email: 'manager@autoservice.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'manager',
    permissions: ['workorders:read', 'workorders:write', 'customers:read', 'customers:write', 'reports:read'],
    avatar: '/avatars/manager.jpg',
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: '3',
    email: 'engineer@autoservice.com',
    firstName: 'Mike',
    lastName: 'Engineer',
    role: 'engineer',
    permissions: ['workorders:read', 'workorders:update', 'inventory:read'],
    avatar: '/avatars/engineer.jpg',
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: '4',
    email: 'advisor@autoservice.com',
    firstName: 'Lisa',
    lastName: 'Advisor',
    role: 'advisor',
    permissions: ['customers:read', 'customers:write', 'workorders:read', 'workorders:write'],
    avatar: '/avatars/advisor.jpg',
    lastLogin: new Date(),
    isActive: true
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('autoservice-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('autoservice-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') { // Simple password for demo
      foundUser.lastLogin = new Date();
      setUser(foundUser);
      localStorage.setItem('autoservice-user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('autoservice-user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true; // Admin has all permissions
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
