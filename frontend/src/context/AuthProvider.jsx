import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Global } from '../helpers/Global';

// Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [loading, setLoading] = useState(true); // Indicador de carga inicial
  const navigate = useNavigate();

  // Función para validar el token
  const validateToken = async (token) => {
    try {
      const response = await fetch(Global.url + 'user/me', {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        return { valid: true, user: userData.user };
      } else {
        return { valid: false, user: null };
      }
    } catch (error) {
      console.error('Error validando token:', error);
      return { valid: false, user: null };
    }
  };

  // Cargar el token desde localStorage cuando la aplicación inicia
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (token && user) {
        // Validar el token con el backend
        const validation = await validateToken(token);
        
        if (validation.valid) {
          setAuth({ token, user: validation.user });
        } else {
          // Token inválido, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuth({ token: null, user: null });
        }
      } else {
        setAuth({ token: null, user: null });
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
    navigate("/social/feed");
  };

  // Gestionar la desconexión y eliminar los datos de autenticación
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
    navigate('/login');
  };

  // Función para actualizar el usuario en el contexto
  const updateUser = (updatedUser) => {
    setAuth(prev => ({ ...prev, user: updatedUser }));
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      auth, 
      setAuth, 
      login, 
      logout, 
      updateUser,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
