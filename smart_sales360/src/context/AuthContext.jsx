import { createContext, useContext, useState, useEffect } from 'react';
import auditService from '../services/auditService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Registrar evento de login
    const nombreUsuario = userData.nombre || userData.username || userData.email || 'Usuario';
    auditService.logLogin(nombreUsuario);
  };

  const logout = () => {
    // Registrar evento de logout antes de limpiar
    const nombreUsuario = user?.nombre || user?.username || user?.email || 'Usuario';
    auditService.logLogout(nombreUsuario);
    
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
