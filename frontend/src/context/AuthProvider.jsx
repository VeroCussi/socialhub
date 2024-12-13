import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Créer le contexte d'authentification
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [loading, setLoading] = useState(true); // Indicateur de chargement initial
  const navigate = useNavigate();

  // Charger le token depuis localStorage lorsque l'application démarre
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // Parse JSON si nécessaire
    if (token && user) {
      setAuth({ token, user });
    }
    setLoading(false); // Charger terminé
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
    navigate("/feed");
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
