import React, { useState } from "react";
import avatar from '../../../assets/img/user.png';
import useAuth from "../../../hooks/useAuth";
import { Global } from "../../../helpers/Global";
import { useForm } from "../../../hooks/useForm";

export const Sidebar = () => {
  const { auth } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");

  const savePost = async (e) => {
    e.preventDefault();

    // Crear FormData y añadir los datos del post
    let formData = new FormData();
    formData.append("content", form.text); // El campo 'content' es el que espera el controlador
    formData.append("userId", auth._id); // Usar el ID del usuario autenticado

    // Añadir la imagen si está presente
    const fileInput = document.querySelector('#file');
    if (fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    // Hacer request para guardar en la base de datos
    const request = await fetch(Global.url + "posts/", {
      method: "POST",
      body: formData,
      headers: {
        'x-auth-token': localStorage.getItem('token') // Asegurarse de que se envíe el token
      },
    });

    const data = await request.json();

    // Mostrar mensaje de éxito o error
    if (data.message === "Post créé avec succès!") {
      setStored("stored");
      const myForm = document.querySelector("#publication-form");
      myForm.reset();
    } else {
      setStored("error");
    }
    
  }

  return (
    <>
      <aside className="layout__aside">
        <header className="aside__header">
          <h1 className="aside__title">Hola, {auth.name}!</h1>
        </header>

        <div className="aside__container">
          <div className="aside__profile-info">
            <div className="profile-info__general-info">
              <div className="general-info__container-avatar">
                {auth.image !== "image.jpg" && (
                  <img
                    src={Global.url + "user/avatar/" + auth.image}
                    className="container-avatar__img"
                    alt="Foto de perfil"
                  />
                )}
                {auth.image === "image.jpg" && (
                  <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                )}
              </div>

              <div className="general-info__container-names">
                <a href="#" className="container-names__name">
                  {auth.name} {auth.surname}
                </a>
                <p className="container-names__nickname">{auth.username}</p>
              </div>
            </div>

            <div className="profile-info__stats">
              <div className="stats__following">
                <a href="#" className="following__link">
                  <span className="following__title">Siguiendo</span>
                  <span className="following__number">10</span>
                </a>
              </div>
              <div className="stats__following">
                <a href="#" className="following__link">
                  <span className="following__title">Seguidores</span>
                  <span className="following__number">13</span>
                </a>
              </div>

              <div className="stats__following">
                <a href="#" className="following__link">
                  <span className="following__title">Publicaciones</span>
                  <span className="following__number">17</span>
                </a>
              </div>
            </div>
          </div>

          <div className="aside__container-form">
            <form id="publication-form" className="container-form__form-post" onSubmit={savePost}>
              <div className="form-post__inputs">
                <label htmlFor="text" className="form-post__label">
                  ¿Qué estás pensando hoy?
                </label>
                <textarea
                  name="text"
                  className="form-post__textarea"
                  onChange={changed}
                />
              </div>

              <div className="form-post__inputs">
                <label htmlFor="file" className="form-post__label">
                  Sube tu foto
                </label>
                <input type="file" name="file0" id="file" className="form-post__image" />
              </div>

              <input
                type="submit"
                value="Enviar"
                className="form-post__btn-submit"
              />
            </form>

            {stored === "stored" && <p className="success-message">Post guardado con éxito.</p>}
            {stored === "error" && <p className="error-message">Hubo un error al guardar el post.</p>}
          </div>
        </div>
      </aside>
    </>
  );
};
