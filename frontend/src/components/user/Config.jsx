import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/img/user.png';

export const Config = () => {
  const { auth, setAuth } = useAuth();
  const { form, changed, setForm } = useForm({});
  const { form: passwordForm, changed: changedPassword, setForm: setPasswordForm } = useForm({});
  
  const [saved, setSaved] = useState("");
  const [passwordSaved, setPasswordSaved] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (auth && auth._id) {
      setForm({
        name: auth.name || '',
        surname: auth.surname || '',
        email: auth.email || '',
        bio: auth.bio || ''
      });
    }
  }, [auth, setForm]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved("");

    try {
      const request = await fetch(Global.url + "user/profile", {
        method: "PUT",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      const data = await request.json();

      if (request.status === 200 && data.status === "success") {
        setSaved("saved");
        // Actualizar el contexto de autenticación con los nuevos datos
        setAuth({ ...auth, ...data.user });
        // Actualizar localStorage
        localStorage.setItem('user', JSON.stringify({ ...auth, ...data.user }));
      } else {
        setSaved("error");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setSaved("error");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSaved("");

    try {
      const request = await fetch(Global.url + "user/change-password", {
        method: "PUT",
        body: JSON.stringify(passwordForm),
        headers: {
          "Content-Type": "application/json",
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      const data = await request.json();

      if (request.status === 200 && data.status === "success") {
        setPasswordSaved("saved");
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordSaved("error");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setPasswordSaved("error");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Configuración del Perfil</h1>
      </header>

      <div className="content__posts">
        <div className="config-container">
          {/* Información del Perfil */}
          <div className="config-section">
            <h2 className="config-section__title">Información Personal</h2>
            
            {saved === "saved" && (
              <strong className="alert alert-success">Perfil actualizado correctamente!</strong>
            )}
            {saved === "error" && (
              <strong className="alert alert-danger">Error al actualizar el perfil!</strong>
            )}

            <form className="config-form" onSubmit={updateProfile}>
              <div className="form-group">
                <label htmlFor="name">Nombre *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name || ''} 
                  onChange={changed}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="surname">Apellido</label>
                <input 
                  type="text" 
                  name="surname" 
                  value={form.surname || ''} 
                  onChange={changed}
                />
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
                <label htmlFor="bio">Biografía</label>
                <textarea 
                  name="bio" 
                  value={form.bio || ''} 
                  onChange={changed}
                  rows="4"
                  placeholder="Cuéntanos algo sobre ti..."
                />
              </div>

              <input 
                type="submit" 
                value={loading ? "Guardando..." : "Guardar Cambios"} 
                className="btn btn-success" 
                disabled={loading}
              />
            </form>
          </div>

          {/* Cambio de Contraseña */}
          <div className="config-section">
            <h2 className="config-section__title">Cambiar Contraseña</h2>
            
            {passwordSaved === "saved" && (
              <strong className="alert alert-success">Contraseña cambiada correctamente!</strong>
            )}
            {passwordSaved === "error" && (
              <strong className="alert alert-danger">Error al cambiar la contraseña!</strong>
            )}

            <form className="config-form" onSubmit={changePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Contraseña Actual *</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwordForm.currentPassword || ''} 
                  onChange={changedPassword}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña *</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordForm.newPassword || ''} 
                  onChange={changedPassword}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordForm.confirmPassword || ''} 
                  onChange={changedPassword}
                  required
                  minLength="6"
                />
              </div>

              <input 
                type="submit" 
                value={passwordLoading ? "Cambiando..." : "Cambiar Contraseña"} 
                className="btn btn-warning" 
                disabled={passwordLoading || passwordForm.newPassword !== passwordForm.confirmPassword}
              />
            </form>
          </div>

          {/* Información del Usuario */}
          <div className="config-section">
            <h2 className="config-section__title">Información de la Cuenta</h2>
            <div className="user-info-display">
              <div className="user-avatar">
                <img 
                  src={auth.image !== "image.jpg" ? Global.url + "user/avatar/" + auth.image : avatar} 
                  alt="Avatar del usuario" 
                  className="user-avatar__img"
                />
              </div>
              <div className="user-details">
                <p><strong>Usuario:</strong> {auth.username}</p>
                <p><strong>Miembro desde:</strong> {new Date(auth.createdAt).toLocaleDateString()}</p>
                <p><strong>Rol:</strong> {auth.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};