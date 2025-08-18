import React from "react";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

export const Login = () => {
    const { form, changed } = useForm({});
    const [saved, setSaved] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { login } = useAuth();

    const loginUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSaved("");
        setErrorMessage("");
        
        // Datos del formulario
        let userToLogin = form;

        try {
            // Requête au backend
            const request = await fetch(Global.url + "user/login", {
                method: "POST",
                body: JSON.stringify(userToLogin),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await request.json();
        
            if (data.status === "success") {
                setSaved("login");
                // Usar la función login del contexto
                login(data.token, data.user);
            } else {
                setSaved("error");
                setErrorMessage(data.message || "Error en el login");
            }
        } catch (error) {
            console.error("Error en login:", error);
            setSaved("error");
            setErrorMessage("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="content__posts">
                {saved === "login" && (
                    <strong className="alert alert-success">
                        Usuario conectado con éxito!
                    </strong>
                )}

                {saved === "error" && (
                    <strong className="alert alert-danger">
                        {errorMessage || "Fallo en la conexión del usuario!"}
                    </strong>
                )}

                <form className="form-login" onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            onChange={changed}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            onChange={changed}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <input 
                        type="submit" 
                        value={loading ? "Conectando..." : "Login"} 
                        className="btn btn-success" 
                        disabled={loading}
                    />
                </form>
            </div>
        </>
    );
};
