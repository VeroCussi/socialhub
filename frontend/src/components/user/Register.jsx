import React from "react";
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const saveUser = async (e) => {
    // Prevenir la actualización de pantalla
    e.preventDefault();

    // Recoger datos del formulario
    let newUser = form;
    console.log("Datos del usuario a enviar:", newUser);

    // Guardar usuario en el backend
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();
    console.log("Respuesta del backend:", data);

    // Verificar si el registro fue exitoso
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
        {/* Mensajes de éxito o error en el registro */}
        {saved === "saved" && (
          <strong className="alert alert-success">User registered successfully!</strong>
        )}

        {saved === "error" && (
          <strong className="alert alert-danger">User not registered!</strong>
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
