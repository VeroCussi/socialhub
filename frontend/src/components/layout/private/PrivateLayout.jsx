import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import useAuth from "../../../hooks/useAuth";

export const PrivateLayout = () => {

    const {auth, loading} = useAuth();

    if(loading){
        return <h1>Chargement...</h1>
    } else {
        return(
            <>
            {/* LAYOUT */}
    
             {/* en-tête et navigation */}
            <Header />
            {/* Contenu principal */}
            <section className='layout__content'>
                {
                    auth._id ?
                    <Outlet />
                    :
                    <Navigate to="/login" />
                }
                
    
            </section>
    
            {/* Sidebar */}
            <Sidebar />
    
            </>
        )
    }
}