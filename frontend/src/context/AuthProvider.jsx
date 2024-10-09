import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Créer le contexte d'authentification
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const navigate = useNavigate();

  // Charger le token depuis localStorage lorsque l'application démarre
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuth({ token, user });
    }
  }, []);

  // Gérer la connexion et enregistrer le token et l'utilisateur
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    setAuth({ token, user });
    navigate('/profile'); // Rediriger vers le profil après la connexion
  };

  // Gérer la déconnexion et supprimer les données d'authentification
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
    navigate('/login'); // Rediriger vers la page de connexion après la déconnexion
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
