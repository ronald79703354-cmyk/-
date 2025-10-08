
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { apiService, LoginCredentials } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
      } catch (e) {
        console.error("No active session or failed to retrieve user", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user: newUser } = await apiService.loginUser(credentials);
    setUser(newUser);
  };

  const logout = async () => {
    try {
        await apiService.logout();
        setUser(null);
    } catch (error) {
        console.error('Logout failed', error);
        // Ensure user is logged out on the client-side even if Supabase call fails
        setUser(null);
    }
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
