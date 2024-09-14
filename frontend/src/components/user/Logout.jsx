import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const Logout = () => {

    const {setAuth} = useAuth();
    const navigate = useNavigate();

    useEffect(() =>{
        // vider le local storage
        localStorage.clear();

        // définir les états globaux à vide
        setAuth({});

        const timer = setTimeout(() => {
            navigate('/login');
        }, 2000); 
    });

    return(
        <h1>Déconnexion en cours...</h1>
    )
}
