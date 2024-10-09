import React from "react";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const saveUser = async (e) => {
    // Empêcher la mise à jour de l'écran
    e.preventDefault();

    // Récupérer les données du formulaire
    let newUser = form;

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
    if (request.status === 200 && data.status.toLowerCase() === "success") {
      setSaved("saved");
    } else {
      setSaved("error");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Register</h1>
      </header>

      <div className="content__posts">
        {/* Messages de succès ou d'erreur lors de l'inscription */}
        {saved === "saved" && (
          <strong className="alert alert-success">Utilisateur inscrit avec succès !</strong>
        )}

        {saved === "error" && (
          <strong className="alert alert-danger">L'utilisateur n'a pas pu être inscrit !</strong>
        )}

        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input type="submit" value="Sign in!" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
