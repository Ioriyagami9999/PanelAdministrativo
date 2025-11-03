import React from "react";
import { useAppSelector } from "../hooks";
import { Navigate } from "react-router-dom";
import { Card } from "primereact/card";

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100 p-4">
      <Card
        title="Mi Perfil"
        subTitle="Tu información personal y de la cuenta"
        className="w-full max-w-2xl shadow-xl border-0 rounded-2xl bg-white/90 backdrop-blur-md"
      >
        {/* Este layout sigue siendo correcto: col en móvil, row en desktop */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 p-4 md:p-6">
          
          <div className="flex-shrink-0">
            {/* CAMBIO AQUÍ:
              - Base (móvil muy pequeño): w-24 (96px)
              - sm (móvil estándar): w-28 (112px)
              - md (tablet+): w-32 (128px)
            */}
            <img
              src={user.image}
              alt="User"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-indigo-200 shadow-md object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            {/* CAMBIO AQUÍ:
              - Base (móvil muy pequeño): text-xl (20px)
              - sm (móvil estándar): text-2xl (24px)
              - md (tablet+): text-3xl (30px)
            */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-indigo-500 font-medium mt-1">@{user.username}</p>

            {/* CAMBIO AQUÍ:
              - Mantenemos tu lógica, sm (14px) en móvil y md:text-base (16px) en desktop.
              - Esto ya era correcto.
            */}
            <div className="mt-4 space-y-2 text-gray-600 text-sm md:text-base">
              <p>
                <span className="font-semibold text-gray-800">Correo:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Género:</span>{" "}
                {user.gender}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;