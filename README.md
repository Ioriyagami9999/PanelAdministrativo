# Panel Administrativo (Frontend)

Este proyecto es una aplicación web de panel de administración construida con un stack moderno de React y TypeScript. Utiliza **Vite** como herramienta de construcción y servidor de desarrollo.

La aplicación se conecta a la API de [dummyjson.com](https://dummyjson.com) para la autenticación y la gestión de datos (CRUD).

## Tecnologías Principales

El ecosistema del proyecto se basa en las siguientes bibliotecas clave:

### 1. Núcleo y Framework

* **React**: Biblioteca principal para construir la interfaz de usuario.
* **TypeScript**: Para el tipado estático y robustez del código.
# Panel Administrativo (Frontend)

Este proyecto es una aplicación web de panel de administración construida con un stack moderno de React y TypeScript. Utiliza **Vite** como herramienta de construcción y servidor de desarrollo.

---

## Tecnologías Clave

El proyecto está desarrollado con las siguientes librerías principales:

* **React & TypeScript**: Núcleo del frontend para construir la interfaz de usuario.
* **Vite**: Herramienta de compilación y servidor de desarrollo rápido.
* **Redux Toolkit & RTK Query**: Gestión de estado y capa de fetching de datos. RTK Query maneja el cacheo, las mutaciones (CRUD) y la invalidación de datos, utilizando code-splitting para organizar los endpoints.
* **PrimeReact & PrimeFlex**: Biblioteca de componentes UI y utilidades de estilo, utilizada para el diseño del dashboard y los formularios.
* **React Hook Form**: Manejo eficiente de formularios con validación.
* **@react-pdf-viewer**: Para la visualización de documentos PDF en la sección de Documentos.

---

## Credenciales de Acceso

La aplicación se conecta a la API de `dummyjson.com`. Utiliza las siguientes credenciales para iniciar sesión:

* **Usuario:** `emilys`
* **Contraseña:** `emilyspass`

---

## Ejecutar Pruebas

El proyecto utiliza **Vitest** y **MSW (Mock Service Worker)** para realizar pruebas unitarias (reducers) y de integración (componentes con data fetching).

### 1. Comando de Ejecución

Para ejecutar toda la suite de pruebas, utiliza el script definido en `package.json`:

```bash
npm run test