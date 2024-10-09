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

    // Créer un FormData et ajouter les données du post
    let formData = new FormData();
    formData.append("content", form.text); // Le champ 'content' est celui attendu par le contrôleur
    formData.append("userId", auth._id); // Utiliser l'ID de l'utilisateur authentifié

    // Ajouter l'image si elle est présente
    const fileInput = document.querySelector('#file');
    if (fileInput.files.length > 0) {
      formData.append("image", fileInput.files[0]);
    }

    // Faire une requête pour enregistrer dans la base de données
    const request = await fetch(Global.url + "posts/", {
      method: "POST",
      body: formData,
      headers: {
        'x-auth-token': localStorage.getItem('token') // S'assurer que le token est envoyé
      },
    });

    const data = await request.json();

    // Afficher un message de succès ou d'erreur
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
          <h1 className="aside__title">Salut, {auth.name}!</h1>
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
                  <span className="following__title">Following</span>
                  <span className="following__number">10</span>
                </a>
              </div>
              <div className="stats__following">
                <a href="#" className="following__link">
                  <span className="following__title">Followers</span>
                  <span className="following__number">13</span>
                </a>
              </div>

              <div className="stats__following">
                <a href="#" className="following__link">
                  <span className="following__title">Posts</span>
                  <span className="following__number">17</span>
                </a>
              </div>
            </div>
          </div>

          <div className="aside__container-form">
            <form id="publication-form" className="container-form__form-post" onSubmit={savePost}>
              <div className="form-post__inputs">
                <label htmlFor="text" className="form-post__label">
                  À quoi pensez-vous aujourd'hui ?
                </label>
                <textarea
                  name="text"
                  className="form-post__textarea"
                  onChange={changed}
                />
              </div>

              <div className="form-post__inputs">
                <label htmlFor="file" className="form-post__label">
                  Téléchargez votre photo
                </label>
                <input type="file" name="file0" id="file" className="form-post__image" />
              </div>

              <input
                type="submit"
                value="Envoyer"
                className="form-post__btn-submit"
              />
            </form>

            {stored === "stored" && <p className="success-message">Post enregistré avec succès.</p>}
            {stored === "error" && <p className="error-message">Une erreur est survenue lors de l'enregistrement du post.</p>}
          </div>
        </div>
      </aside>
    </>
  );
};
