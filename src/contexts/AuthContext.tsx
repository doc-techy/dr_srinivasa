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
  is_admin?: boolean;
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

  // Staff accounts on the shared server belong to other doctors, so only the
  // Srinivasa-specific admin check grants access here.
  const isAdmin = user?.is_admin ?? false;

  const withAdminFlag = async (userData: User, accessToken: string): Promise<User | null> => {
    const adminCheck = await apiClient.checkAdmin(accessToken);
    return adminCheck.success && adminCheck.data?.is_admin ? { ...userData, is_admin: true } : null;
  };

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
              const adminUser = await withAdminFlag(response.data.user, parsedTokens.access);
              if (adminUser) {
                setUser(adminUser);
              } else {
                localStorage.removeItem('admin_tokens');
                setTokens(null);
                setUser(null);
              }
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
                  const adminUser = userResponse.success && userResponse.data
                    ? await withAdminFlag(userResponse.data.user, refreshResponse.data.access)
                    : null;
                  if (adminUser) {
                    setUser(adminUser);
                  } else {
                    localStorage.removeItem('admin_tokens');
                    setTokens(null);
                    setUser(null);
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
        
        const adminUser = await withAdminFlag(userData, newTokens.access);
        if (adminUser) {
          console.log('✅ AuthContext: User is admin, setting authentication state');
          setTokens(newTokens);
          setUser(adminUser);
          localStorage.setItem('admin_tokens', JSON.stringify(newTokens));
          return true;
        }
        console.log('❌ AuthContext: User is not a Dr. Srinivasa admin, login failed');
        return false;
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
