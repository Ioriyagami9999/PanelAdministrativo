

import "./css/ProfilePage.css";
import React from "react";
import { useAppSelector } from "../hooks";
import { Navigate } from "react-router-dom";
import { Card } from "primereact/card";

const ProfilePage = () => {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="w-full max-w-md p-5">
        <Card className="shadow-xl rounded-2xl border-0 bg-white/90 backdrop-blur-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mi Perfil</h2>
            <p className="text-sm text-gray-500 mb-6">Tu información personal y de la cuenta</p>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={user.image}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-blue-200 shadow-md"
              />
              <h3 className="text-lg font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
              <a href={`mailto:${user.email}`} className="text-blue-500 text-sm">@{user.username}</a>
              <div className="mt-3 text-sm text-gray-600">
                <p><span className="font-semibold">Correo:</span> {user.email}</p>
                <p><span className="font-semibold">Género:</span> {user.gender}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
