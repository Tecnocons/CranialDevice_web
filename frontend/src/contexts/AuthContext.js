import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const LoadingContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const useLoading = () => useContext(LoadingContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
    setAuthLoading(false);
  }, []);

  const login = (userData) => {
    if (!userData.helmetId) {
      console.error("helmetId is missing in userData");
      return;
    }
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: login, logout, loading: authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
