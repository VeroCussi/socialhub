import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import useAuth from "../../../hooks/useAuth";
import { Global } from "../../../helpers/Global";

export const PrivateLayout = () => {
    const { auth, loading, logout } = useAuth();

    // Interceptor para verificar el token en cada petición
    useEffect(() => {
        const checkTokenValidity = async () => {
            if (!auth.token) return;

            try {
                const response = await fetch(Global.url + 'user/me', {
                    method: 'GET',
                    headers: {
                        'x-auth-token': auth.token,
                    },
                });

                if (!response.ok) {
                    // Token inválido, hacer logout
                    logout();
                }
            } catch (error) {
                console.error('Error verificando token:', error);
                // En caso de error de conexión, no hacer logout automáticamente
            }
        };

        // Verificar token cada 5 minutos
        const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);
        
        // Verificar al montar el componente
        checkTokenValidity();

        return () => clearInterval(interval);
    }, [auth.token, logout]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px',
                color: '#666'
            }}>
                Cargando...
            </div>
        );
    }

    // Verificar si el usuario está autenticado
    if (!auth.token || !auth.user || !auth.user._id) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            {/* LAYOUT */}
            {/* En-tête et navigation */}
            <Header />
            
            {/* Contenu principal */}
            <section className='layout__content'>
                <Outlet />
            </section>

            {/* Sidebar */}
            <Sidebar />
        </>
    );
};