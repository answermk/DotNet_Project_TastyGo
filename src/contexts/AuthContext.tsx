import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { API_CONFIG } from '../config/api';
import { useNotifications } from './NotificationContext';

export type User = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    mfa: boolean;
  };
  permissions: string[];
  lastLogin?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyMFA: (code: string) => Promise<void>;
  setupMFA: () => Promise<{ secret: string; qrCode: string }>;
  enableMFA: (code: string) => Promise<void>;
  disableMFA: (code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setMfaRequired] = useState(false);
  const { addNotification } = useNotifications();
  const isAuthenticated = !!user;

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('tastygo_user');
    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      if (userData.lockedUntil && new Date(userData.lockedUntil) > new Date()) {
        logout();
        addNotification('error', 'Your account is locked. Please try again later.'); // Keep as 2 params (title optional)
        return;
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user: userData, requiresMfa } = response.data;
      
      if (requiresMfa) {
        setMfaRequired(true);
        return;
      }
      
      // Store token and user data
      localStorage.setItem('token', token);
      const normalizedUser = {
        ...userData,
        isAdmin: userData.isAdmin ?? userData.role === 'admin',
      };
      localStorage.setItem('tastygo_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      addNotification('success', 'Successfully logged in!');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response?.status === 429) {
        addNotification('error', 'Too many login attempts. Your account has been locked temporarily.');
      } else {
        addNotification('error', 'Invalid email or password');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verify MFA code
  const verifyMFA = async (code: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_MFA, { code });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      const normalizedUser = {
        ...userData,
        isAdmin: userData.isAdmin ?? userData.role === 'admin',
      };
      localStorage.setItem('tastygo_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      setMfaRequired(false);
      addNotification('success', 'Successfully verified MFA code!');
    } catch (error) {
      console.error('MFA verification failed:', error);
      addNotification('error', 'Invalid MFA code');
      throw error;
    }
  };

  // Setup MFA
  const setupMFA = async () => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.SETUP_MFA);
      return response.data;
    } catch (error) {
      console.error('MFA setup failed:', error);
      addNotification('error', 'Failed to setup MFA');
      throw error;
    }
  };

  // Enable MFA
  const enableMFA = async (code: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.ENABLE_MFA, { code });
      const updatedUser = response.data;
      
      localStorage.setItem('tastygo_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      addNotification('success', 'MFA has been enabled successfully!');
    } catch (error) {
      console.error('Failed to enable MFA:', error);
      addNotification('error', 'Failed to enable MFA');
      throw error;
    }
  };

  // Disable MFA
  const disableMFA = async (code: string) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.DISABLE_MFA, { code });
      const updatedUser = response.data;
      
      localStorage.setItem('tastygo_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      addNotification('success', 'MFA has been disabled successfully!');
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      addNotification('error', 'Failed to disable MFA');
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Check if email contains 'admin' to determine role
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
      
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
        role, // Send role to backend
      });

      const { token, user: userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      const normalizedUser = {
        ...userData,
        isAdmin: userData.isAdmin ?? userData.role === 'admin',
      };
      localStorage.setItem('tastygo_user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      
      // Show appropriate success message based on role
      const successMessage = role === 'admin' 
        ? 'Admin account created successfully! Please verify your email.'
        : 'Registration successful! Please verify your email.';
      
      addNotification('success', successMessage);
    } catch (error) {
      console.error('Registration failed:', error);
      addNotification('error', 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, { email });
      addNotification('success', 'Password reset instructions have been sent to your email.');
    } catch (error) {
      console.error('Password reset failed:', error);
      addNotification('error', 'Failed to send password reset instructions');
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      addNotification('success', 'Password changed successfully!');
    } catch (error) {
      console.error('Password change failed:', error);
      addNotification('error', 'Failed to change password');
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tastygo_user');
    setUser(null);
    setMfaRequired(false);
    addNotification('info', 'You have been logged out');
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    try {
      const response = await api.put(`${API_CONFIG.ENDPOINTS.USERS.BASE}/profile`, data);
      const updatedUser = response.data;
      
      localStorage.setItem('tastygo_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      addNotification('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      addNotification('error', 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        verifyMFA,
        setupMFA,
        enableMFA,
        disableMFA,
        resetPassword,
        changePassword,
        hasPermission,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};