import React from "react";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import PrivateRoute from "../features/auth/PrivateRoute";

// --- 1. Importamos el Layout CORRECTO (PanelPage) ---
import PanelPage from "../pages/PanelPage"; 

// --- 2. Importamos todas las páginas que van adentro ---
import PostsTable from "../features/posts/PostsTable";
import PostForm from "../features/posts/PostForm";
import PDFViewer from "../components/PDFViewer";
import ProfilePage from "../pages/ProfilePage";
import FetchPosts from "../pages/fetchPosts";
import UserPage from "../pages/UsersPage";

// --- 3. Importamos los hooks para el Logout ---
import { useAppDispatch } from "../hooks";
import { logout } from "../features/auth/authSlice";

// --- 4. Creamos un componente "Wrapper" para el Layout ---
// Esto es necesario para poder usar los hooks (useNavigate, useDispatch)
// y pasarlos como prop 'onLogout' a PanelPage.
const PrivateLayoutWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    console.log("Cerrando sesión y redirigiendo...");
    dispatch(logout());
    navigate("/login");
  };

  // Renderizamos PanelPage (que tiene el <Outlet> para las rutas hijas)
  // y le pasamos la función de logout que necesita.
  return <PanelPage onLogout={handleLogout} />;
};




const AppRoutes: React.FC = () => (
  <Routes>
 
    <Route path="/login" element={<LoginPage />} />

  
    <Route element={<PrivateRoute />}>
      
   
      <Route element={<PrivateLayoutWrapper />}>
        
   
        <Route index element={<Navigate to="/profile" replace />} />

  
        <Route path="profile" element={<ProfilePage />} />

        <Route path="users" element={<UserPage />} />
        <Route path="fetch" element={<FetchPosts />} />
        <Route path="posts/new" element={<PostForm />} />
        <Route path="posts/:id/edit" element={<PostForm />} />
        <Route path="docs" element={<PDFViewer />} />
        
      </Route>
    </Route>

    <Route path="*" element={<h2>404: Página no encontrada</h2>} />
  </Routes>
);

export default AppRoutes;