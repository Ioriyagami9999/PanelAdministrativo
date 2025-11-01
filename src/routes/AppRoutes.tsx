import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import PrivateRoute from "../features/auth/PrivateRoute";
import Layout from "../components/Layout";
import PostsTable from "../features/posts/PostsTable";
import PostForm from "../features/posts/PostForm";
import PDFViewer from "../components/PDFViewer";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<PrivateRoute />}>
      <Route path="/" element={<Layout><PostsTable/></Layout>} />
      <Route path="/posts/new" element={<Layout><PostForm/></Layout>} />
      <Route path="/posts/:id/edit" element={<Layout><PostForm/></Layout>} />
      <Route path="/docs" element={<Layout><PDFViewer/></Layout>} />
    </Route>
    <Route path="*" element={<div>404</div>} />
  </Routes>
);

export default AppRoutes;
