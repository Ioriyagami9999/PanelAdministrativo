# Panel Administrativo (Frontend)

Este proyecto es una aplicación web de panel de administración construida con un stack moderno de React y TypeScript. Utiliza **Vite** como herramienta de construcción y servidor de desarrollo.

La aplicación se conecta a la API de [dummyjson.com](https://dummyjson.com) para la autenticación y la gestión de datos (CRUD).

## Tecnologías Principales

El ecosistema del proyecto se basa en las siguientes bibliotecas clave:

### 1. Núcleo y Framework

* **React**: Biblioteca principal para construir la interfaz de usuario.
* **TypeScript**: Para el tipado estático y robustez del código.
* **Vite**: Herramienta de frontend para un desarrollo y compilación extremadamente rápidos.

### 2. Gestión de Estado y Datos

* **Redux Toolkit**: El estándar moderno para la gestión de estado en React. Se usa para manejar el estado global de la aplicación, como la autenticación.
* **RTK Query**: Parte de Redux Toolkit, se utiliza para gestionar el fetching de datos, el cacheo y las mutaciones (POST, PUT, DELETE) de forma declarativa. El proyecto utiliza *code-splitting* para inyectar endpoints de `postsApi` y `usersApi` en la API principal.
* **React Redux**: Para conectar los componentes de React al store de Redux.

### 3. Componentes UI y Estilos

* **PrimeReact**: La biblioteca de componentes UI principal. Se utilizan componentes como `Card`, `Button`, `DataTable`, `Dialog`, `InputText`, `Toast`, etc.
* **PrimeIcons**: La biblioteca de iconos oficial de PrimeReact.
* **PrimeFlex**: Un sistema de grid y utilidades CSS (similar a Tailwind) para complementar a PrimeReact.
* **React Icons**: Utilizada para iconos en el layout principal del panel (ej. `FiHome`, `FiUsers`).

### 4. Enrutamiento y Formularios

* **React Router DOM**: Se usa para manejar el enrutamiento del lado del cliente. El archivo `AppRoutes.tsx` define las rutas públicas y privadas, utilizando un `PrivateRoute` para proteger el dashboard.
* **React Hook Form**: Para una gestión de formularios eficiente y con validación, como se ve en el `LoginPage` y `PostForm`.

### 5. Utilidades Adicionales

* **@react-pdf-viewer**: Un conjunto de bibliotecas (`core` y `default-layout`) utilizadas para renderizar e interactuar con documentos PDF directamente en el navegador.

### 6. Pruebas y Calidad de Código

* **Vitest**: El framework de pruebas unitarias y de integración, configurado en `vite.config.ts`.
* **Testing Library (React)**: Para escribir pruebas centradas en el usuario.
* **MSW (Mock Service Worker)**: Para interceptar y simular peticiones de red durante las pruebas, asegurando que los tests sean fiables e independientes de la API real.
* **ESLint**: Para el análisis estático y la calidad del código.
* **Prettier**: Para mantener un formato de código consistente.

## Cómo Iniciar Sesión

* **Usuario:** `emilys`
* **Contraseña:** `emilyspass`