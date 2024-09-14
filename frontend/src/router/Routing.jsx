import React from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { Register } from "../components/user/Register";
import { Logout } from "../components/user/Logout";
import { Login } from "../components/user/Login";
import { Feed } from "../components/post/Feed";
import { AuthProvider } from "../context/AuthProvider";
import { People } from "../components/user/People";
import { Config } from "../components/user/Config";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/social" element={<PrivateLayout />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="logout" element={<Logout />} />
            <Route path="people" element={<People />} />
            <Route path="settings" element={<Config />} />
          </Route>

          <Route
            path="/*"
            element={
              <>
                <p>
                  <h1>Error 404</h1>
                  <Link to="/">Return to the Home</Link>
                </p>
              </>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
