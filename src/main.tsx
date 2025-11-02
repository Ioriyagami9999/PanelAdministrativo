import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
// --- 1. Importamos BrowserRouter aquí ---
import { BrowserRouter } from "react-router-dom";

// --- 2. CAMBIAMOS LA IMPORTACIÓN ---
// import App from "./App"; // Ya no usamos App.tsx
import AppRoutes from "./routes/AppRoutes"; // Usamos AppRoutes.tsx

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"; // (Me aseguro que este esté aquí)
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* 3. Envolvemos AppRoutes con BrowserRouter */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);