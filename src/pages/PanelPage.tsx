import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FiHome, FiUsers, FiFileText, FiLogOut } from "react-icons/fi";
// Asegúrate de tener este archivo CSS o el layout se verá mal
import "./css/PanelPage.css"; 

// --- El "contrato" que exige la prop ---
interface PanelPageLayoutProps {
  onLogout: () => void;
}

const PanelPage: React.FC<PanelPageLayoutProps> = ({ onLogout }) => {
  return (
    <div className="dashboard-layout">
      {/* 🧭 Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📊 Panel</h2>
        </div>

        <nav className="menu">
          <Link to="/dashboard" className="menu-item">
            <FiHome /> <span>Dashboard</span>
          </Link>
          <Link to="/usuarios" className="menu-item">
            <FiUsers /> <span>Usuarios</span>
          </Link>
          <Link to="/publicaciones" className="menu-item">
            <FiFileText /> <span>Publicaciones</span>
          </Link>
        </nav>

        {/* --- Aquí se usa la prop --- */}
        <button className="logout-btn" onClick={onLogout}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* 📄 Contenido principal (donde se renderizan las rutas hijas) */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PanelPage;