import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usersApi } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('techvick_staff_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('techvick_staff_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('techvick_staff_session');
    }
  }, [user]);

  // Store Staff Secure Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      // Official Store Management Credentials
      const isStoreEmail = cleanEmail === 'techvickcomputers@gmail.com' || cleanEmail === 'admin@techvick.com';
      const isCorrectPassword = cleanPass === 'Techvick@123';

      if (isStoreEmail && isCorrectPassword) {
        let staffObj = {
          id: 'staff-techvick-01',
          name: 'Store Manager',
          email: 'techvickcomputers@gmail.com',
          role: 'admin',
          store: 'Techvick Computers - Tatabad Branch',
        };
        let token = 'techvick_store_manager_token';

        try {
          const res = await usersApi.login({ email: cleanEmail, password: cleanPass });
          if (res?.token) {
            token = res.token;
            if (res.user) {
              staffObj = { ...staffObj, ...res.user, store: 'Techvick Computers - Tatabad Branch' };
            }
          }
        } catch {
          // Keep resilient local admin bypass token
        }

        localStorage.setItem('techvick_token', token);
        setUser(staffObj);
        toast.success('Welcome to Techvick Store Portal!', { icon: '🔐' });
        return staffObj;
      }

      throw new Error('Invalid Store Email or Password. Please use official credentials.');
    } catch (err) {
      toast.error(err.message || 'Access denied');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('techvick_staff_session');
    localStorage.removeItem('techvick_token');
    toast('Store Staff session closed', { icon: '🔒' });
  };

  const isAdmin = user?.role === 'admin';
  const isStoreStaff = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isStoreStaff,
        isAuthenticated: isStoreStaff,
        loading,
        login,
        logout,
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
