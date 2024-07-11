import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
    setLoading(false);
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
    <AuthContext.Provider value={{ user, setUser: login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
