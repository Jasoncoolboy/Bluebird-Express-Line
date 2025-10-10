import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedUser = localStorage.getItem('bluebird_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await ApiService.login({ username, password });
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        // Store the token
        localStorage.setItem('bluebird_token', token);
        
        // Store user data
        const userInfo = {
          id: userData.id,
          username: userData.username,
          role: userData.role as 'admin' | 'manager'
        };
        setUser(userInfo);
        localStorage.setItem('bluebird_admin_user', JSON.stringify(userInfo));
        return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bluebird_admin_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};