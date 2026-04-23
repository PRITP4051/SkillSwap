import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setUnauthorizedHandler } from '../lib/api';
import { disconnectSocket } from '../lib/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('skillswap_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(({ data }) => { if (data.success) setUser(data.data); })
      .catch(() => localStorage.removeItem('skillswap_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('skillswap_token', data.data.token);
      setUser(data.data.user);
    }
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    if (data.success) {
      localStorage.setItem('skillswap_token', data.data.token);
      setUser(data.data.user);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('skillswap_token');
    disconnectSocket();
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      disconnectSocket();
      setUser(null);
      window.location.replace('/login');
    });
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get('/auth/me');
    if (data.success) setUser(data.data);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
