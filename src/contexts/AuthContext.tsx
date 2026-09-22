'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  tokens: { access: string; refresh: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAdmin: boolean;
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
  const [tokens, setTokens] = useState<{ access: string; refresh: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAdmin = user?.is_staff || user?.is_superuser || false;

  // Check for existing tokens on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔐 AuthContext: Checking authentication...');
      try {
        const storedTokens = localStorage.getItem('admin_tokens');
        console.log('🔐 AuthContext: Stored tokens found:', !!storedTokens);
        
        if (storedTokens) {
          const parsedTokens = JSON.parse(storedTokens);
          console.log('🔐 AuthContext: Parsed tokens:', {
            hasAccess: !!parsedTokens.access,
            hasRefresh: !!parsedTokens.refresh
          });
          
          // Set tokens first to prevent redirect loops
          setTokens(parsedTokens);
          
          // Verify token is still valid
          try {
            const response = await apiClient.verifyToken(parsedTokens.access);
            if (response.success && response.data?.valid) {
              console.log('✅ AuthContext: Token is valid, setting user');
              setUser(response.data.user);
            } else {
              console.log('❌ AuthContext: Token invalid, attempting refresh');
              // Token invalid, try to refresh
              try {
                const refreshResponse = await apiClient.refreshToken(parsedTokens.refresh);
                if (refreshResponse.success && refreshResponse.data) {
                  console.log('✅ AuthContext: Token refreshed successfully');
                  const newTokens = {
                    access: refreshResponse.data.access,
                    refresh: parsedTokens.refresh
                  };
                  setTokens(newTokens);
                  localStorage.setItem('admin_tokens', JSON.stringify(newTokens));
                  
                  // Get user profile with new token
                  const userResponse = await apiClient.getUserProfile(refreshResponse.data.access);
                  if (userResponse.success && userResponse.data) {
                    setUser(userResponse.data.user);
                  }
                } else {
                  console.log('❌ AuthContext: Token refresh failed, clearing tokens');
                  // Refresh failed, clear tokens
                  localStorage.removeItem('admin_tokens');
                  setTokens(null);
                  setUser(null);
                }
              } catch (refreshError) {
                console.error('💥 AuthContext: Token refresh error:', refreshError);
                localStorage.removeItem('admin_tokens');
                setTokens(null);
                setUser(null);
              }
            }
          } catch (verifyError) {
            console.error('💥 AuthContext: Token verification error:', verifyError);
            // If verification fails, clear tokens to prevent loops
            localStorage.removeItem('admin_tokens');
            setTokens(null);
            setUser(null);
          }
        } else {
          console.log('🔐 AuthContext: No stored tokens found');
        }
      } catch (error) {
        console.error('💥 AuthContext: Auth check failed:', error);
        localStorage.removeItem('admin_tokens');
        setTokens(null);
        setUser(null);
      } finally {
        console.log('🔐 AuthContext: Authentication check completed');
        setLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔐 AuthContext: Attempting login for user:', username);
      const response = await apiClient.login(username, password);
      
      if (response.success && response.data) {
        const { tokens: newTokens, user: userData } = response.data;
        console.log('🔐 AuthContext: Login successful, checking admin privileges...');
        
        // Check if user is admin
        const adminCheck = await apiClient.checkAdmin(newTokens.access);
        
        if (adminCheck.success && adminCheck.data?.is_admin) {
          console.log('✅ AuthContext: User is admin, setting authentication state');
          setTokens(newTokens);
          setUser(userData);
          localStorage.setItem('admin_tokens', JSON.stringify(newTokens));
          return true;
        } else {
          console.log('❌ AuthContext: User is not admin, login failed');
          // Also check if user has staff/superuser flags as fallback
          if (userData?.is_staff || userData?.is_superuser) {
            console.log('✅ AuthContext: User has staff/superuser flags, allowing access');
            setTokens(newTokens);
            setUser(userData);
            localStorage.setItem('admin_tokens', JSON.stringify(newTokens));
            return true;
          }
          return false;
        }
      }
      console.log('❌ AuthContext: Login failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('💥 AuthContext: Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refresh) {
        await apiClient.logout(tokens.refresh);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setTokens(null);
      setUser(null);
      localStorage.removeItem('admin_tokens');
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    login,
    logout,
    loading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
