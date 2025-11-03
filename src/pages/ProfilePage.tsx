

import React from "react";
import { useAppSelector } from "../hooks";
import { Navigate } from "react-router-dom";
import { Card } from "primereact/card";
import "./css/ProfilePage.css";

const ProfilePage: React.FC = () => {
const { user } = useAppSelector((state) => state.auth);

if (!user) {
return <Navigate to="/login" replace />;
}

return (
<div className="profile-container">
<Card title="Mi Perfil" subTitle="Tu información personal y de la cuenta" className="profile-card" >
<div className="profile-content">
<div className="profile-image">
<img src={user.image} alt="User" />
</div>

      <div className="profile-info">
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p className="username">@{user.username}</p>

        <div className="details">
          <p>
            <span>Correo:</span> {user.email}
          </p>
          <p>
            <span>Género:</span> {user.gender}
          </p>
        </div>
      </div>
    </div>
  </Card>
</div>


);
};

export default ProfilePage;