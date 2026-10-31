import { createContext, useContext, useState, useEffect } from 'react';
import { usersApi } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('techmart_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('techmart_token') || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('techmart_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('techmart_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('techmart_token', token);
    } else {
      localStorage.removeItem('techmart_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await usersApi.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      toast.success(`Welcome back, ${res.user.name}! (${res.user.role === 'admin' ? '👑 Admin' : '👤 Customer'})`);
      return res.user;
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@techmart.in', 'Admin@12345');
  };

  const loginAsDemoCustomer = async () => {
    return login('customer@techmart.in', 'Customer@123');
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await usersApi.register(userData);
      setUser(res.user);
      setToken(res.token);
      toast.success(`Account created! Welcome to TechMart, ${res.user.name}`);
      return res.user;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('techmart_user');
    localStorage.removeItem('techmart_token');
    toast('Logged out successfully', { icon: '👋' });
  };

  const switchRole = () => {
    if (user?.role === 'admin') {
      loginAsDemoCustomer();
    } else {
      loginAsDemoAdmin();
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isAuthenticated,
        loading,
        login,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
