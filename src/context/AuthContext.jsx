import React, { createContext, useContext, useState, useEffect } from 'react';
import plantifyApi from '../services/plantifyApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = plantifyApi.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await plantifyApi.getMe();
        if (profile) {
          setUser(profile);
        } else {
          plantifyApi.setToken(null);
        }
      } catch (err) {
        // Token invalid or expired
        plantifyApi.setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await plantifyApi.login({ email, password });
    if (response?.user) {
      setUser(response.user);
    }
    setAuthModalOpen(false);
    return response;
  };

  const register = async (userData) => {
    const response = await plantifyApi.register(userData);
    if (response?.user) {
      setUser(response.user);
    }
    setAuthModalOpen(false);
    return response;
  };

  const logout = async () => {
    await plantifyApi.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await plantifyApi.updateProfile(profileData);
    if (updated) {
      setUser(updated);
    }
    return updated;
  };

  const openLoginModal = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateProfile,
    authModalOpen,
    authModalTab,
    setAuthModalTab,
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
