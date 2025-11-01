import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-xl font-semibold">Mi Aplicación</h1>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-gray-200 text-center py-3 text-sm">
        © {new Date().getFullYear()} — Todos los derechos reservados
      </footer>
    </div>
  );
}
