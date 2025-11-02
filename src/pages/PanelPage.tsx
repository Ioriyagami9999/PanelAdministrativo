import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FiHome, FiUsers, FiFileText, FiLogOut, FiArchive } from "react-icons/fi";

import "./css/PanelPage.css"; 


interface PanelPageLayoutProps {
  onLogout: () => void;
}

const PanelPage: React.FC<PanelPageLayoutProps> = ({ onLogout }) => {
  return (
    <div className="dashboard-layout">

      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Panel administrativo</h2>
        </div>

        <nav className="menu">
          <Link to="/profile" className="menu-item">
            <FiHome /> <span>Perfil</span>
          </Link>
          <Link to="/users" className="menu-item">
            <FiUsers /> <span>Usuarios</span>
          </Link>
          <Link to="/fetch" className="menu-item">
            <FiFileText /> <span>Publicaciones</span>
          </Link>
          <Link to="/docs" className="menu-item">
            <FiArchive /> <span>Documentos</span>
          </Link>
        </nav>

       
        <button className="logout-btn" onClick={onLogout}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

  
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PanelPage;