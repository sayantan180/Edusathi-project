import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      try {
        // Prefer snake_case tokens to match server and the rest of the app
        const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user') || localStorage.getItem('userProfile');
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          // Optionally verify token with backend
          await authAPI.getProfile();
        }
      } catch (error) {
        // Token invalid, clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, access_token, refresh_token } = response.data;

      // Store snake_case tokens (primary)
      if (access_token) localStorage.setItem('access_token', access_token);
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
      // Back-compat: also store camelCase if some parts still read them
      if (access_token) localStorage.setItem('accessToken', access_token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      // Compatibility with some pages using these keys
      localStorage.setItem('userProfile', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      if (userData?.role) localStorage.setItem('userRole', userData.role);
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'creator') => {
    try {
      const response = await authAPI.register({ name, email, password, role });
      const { user: userData, access_token, refresh_token } = response.data;

      if (access_token) localStorage.setItem('access_token', access_token);
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
      if (access_token) localStorage.setItem('accessToken', access_token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userProfile', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      if (userData?.role) localStorage.setItem('userRole', userData.role);
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      const userData = res.data?.user;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (_e) {
      // ignore
    }
  };

  const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    await authAPI.updateAvatar(formData);
    await refreshProfile();
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refreshProfile,
    updateAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
