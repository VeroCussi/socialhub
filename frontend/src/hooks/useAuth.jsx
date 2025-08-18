import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    
    // Función helper para verificar si el usuario está autenticado
    const isAuthenticated = () => {
        return !!(context.auth.token && context.auth.user && context.auth.user._id);
    };
    
    // Función helper para obtener el token
    const getToken = () => {
        return context.auth.token;
    };
    
    // Función helper para obtener el usuario
    const getUser = () => {
        return context.auth.user;
    };
    
    return {
        ...context,
        isAuthenticated,
        getToken,
        getUser
    };
};

export default useAuth;