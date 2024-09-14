import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto de autenticación
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const navigate = useNavigate();

  // Cargar el token desde localStorage cuando la app se inicia
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuth({ token, user });
    }
  }, []);

  // Manejar el login y guardar el token y user
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    setAuth({ token, user });
    navigate('/profile'); // Redirigir al perfil después de hacer login
  };

  // Manejar el logout y eliminar los datos de autenticación
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
    navigate('/login'); // Redirigir a la página de login después de hacer logout
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
