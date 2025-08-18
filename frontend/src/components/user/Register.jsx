import React from "react";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";

export const Register = () => {
  const { form, changed, setForm } = useForm({});
  const [saved, setSaved] = useState("not_sended");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const saveUser = async (e) => {
    // Empêcher la mise à jour de l'écran
    e.preventDefault();
    setLoading(true);
    setSaved("not_sended");
    setErrorMessage("");

    try {
      // Récupérer les données du formulaire
      let newUser = form;

      // Validaciones del frontend
      if (!newUser.name || !newUser.email || !newUser.username || !newUser.password) {
        setSaved("error");
        setErrorMessage("Todos los campos son obligatorios");
        setLoading(false);
        return;
      }

      if (newUser.password.length < 6) {
        setSaved("error");
        setErrorMessage("La contraseña debe tener al menos 6 caracteres");
        setLoading(false);
        return;
      }

      if (newUser.username.length < 3) {
        setSaved("error");
        setErrorMessage("El username debe tener al menos 3 caracteres");
        setLoading(false);
        return;
      }

      // Enregistrer l'utilisateur dans le backend
      const request = await fetch(Global.url + "user/register", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await request.json();

      // Vérifier si l'inscription a réussi
      if (request.status === 201 && data.status === "success") {
        setSaved("saved");
        setForm({}); // Limpiar el formulario
        setErrorMessage("");
      } else {
        setSaved("error");
        setErrorMessage(data.message || "Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setSaved("error");
      setErrorMessage("Error de conexión. Verifica que el backend esté funcionando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">
        {/* Messages de succès ou d'erreur lors de l'inscription */}
        {saved === "saved" && (
          <strong className="alert alert-success">
            ¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.
          </strong>
        )}

        {saved === "error" && (
          <strong className="alert alert-danger">
            {errorMessage || "El usuario no ha podido ser registrado"}
          </strong>
        )}

        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input 
              type="text" 
              name="name" 
              value={form.name || ''} 
              onChange={changed} 
              required
              minLength="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input 
              type="text" 
              name="username" 
              value={form.username || ''} 
              onChange={changed} 
              required
              minLength="3"
            />
            <small>Mínimo 3 caracteres</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input 
              type="email" 
              name="email" 
              value={form.email || ''} 
              onChange={changed} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input 
              type="password" 
              name="password" 
              value={form.password || ''} 
              onChange={changed} 
              required
              minLength="6"
              autoComplete="new-password"
            />
            <small>Mínimo 6 caracteres</small>
          </div>

          <input 
            type="submit" 
            value={loading ? "Registrando..." : "Registrarse"} 
            className="btn btn-success" 
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
};
