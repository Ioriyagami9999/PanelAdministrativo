import React from "react";
import { 
  BrowserRouter, // El "envoltorio" principal
  Routes, 
  Route, 
  useNavigate  // Hook para redirigir
} from "react-router-dom";

// --- Importamos nuestro Layout ---
import DashboardLayout from "./pages/PanelPage"; // Ajusta esta ruta

// --- Componentes de ejemplo para las páginas ---
// (En tu proyecto, estos serían imports de tus propios archivos)
const PaginaLogin = () => (
  <div>
    <h2>Página de Login</h2>
    <p>Aquí iría tu formulario de inicio de sesión.</p>
  </div>
);
const PaginaDashboard = () => <h3>Contenido del Dashboard</h3>;
const PaginaUsuarios = () => <h3>Gestión de Usuarios</h3>;
const PaginaPublicaciones = () => <h3>Gestión de Publicaciones</h3>;


// --- Componente App (Hijo del Router) ---
// Lo separamos para poder usar el hook 'useNavigate'
function App() {
  
  // 1. Obtenemos la función 'navigate' para poder redirigir
  const navigate = useNavigate();

  // 2. ✨ AQUÍ SE CREA LA FUNCIÓN `handleLogout` ✨
  // Esta función define QUÉ PASA al cerrar sesión.
  const handleLogout = () => {
    console.log("Cerrando sesión y redirigiendo...");

    // --- Aquí pones tu lógica real de logout ---
    // Por ejemplo, limpiar el token de autenticación:
    localStorage.removeItem("userToken");

    // O llamar a tu contexto de autenticación:
    // auth.signOut();
    // ------------------------------------------

    // 3. Redirigimos al usuario a la página de login
    navigate("/login");
  };

  return (
    <Routes>
      {/* Ruta pública para el Login */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* --- 👇 AQUÍ ESTÁ LA CORRECCIÓN 👇 --- */}
      {/* Definimos una ruta "padre" que usa DashboardLayout.
        Le pasamos la función `handleLogout` a la prop `onLogout`,
        cumpliendo así con el contrato de TypeScript.
      */}
      <Route 
        path="/" 
        element={ <DashboardLayout onLogout={handleLogout} /> }
      >
        {/* Estas rutas "hijas" se renderizarán donde pusiste el <Outlet />
          Nota: Los paths son relativos a la ruta padre ("/").
        */}
        <Route path="dashboard" element={<PaginaDashboard />} />
        <Route path="usuarios" element={<PaginaUsuarios />} />
        <Route path="publicaciones" element={<PaginaPublicaciones />} />
      </Route>
      
      {/* Puedes agregar una ruta "catch-all" o de "no encontrado" */}
      <Route path="*" element={<h2>404: Página no encontrada</h2>} />
    </Routes>
  );
}

// --- Componente principal que envuelve todo en el Router ---
// (Usualmente esto está en 'index.tsx', pero lo pongo aquí
// para que el ejemplo esté completo)
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;