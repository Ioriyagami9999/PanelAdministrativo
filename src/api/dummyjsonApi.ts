import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import type { Post, LoginRequest, LoginResponse, User } from "../utils/types";
// --- 1. Importamos la acción de logout ---
import { logout } from "../features/auth/authSlice";

// --- 2. Definimos el baseQuery original ---
const baseQuery = fetchBaseQuery({
  baseUrl: "https://dummyjson.com",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// --- 3. Creamos un "wrapper" para el baseQuery que intercepte errores ---
const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // Comprobamos si la petición falló con un error 401 (Token caducado/inválido)
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    // Si es 401, despachamos la acción de logout
    api.dispatch(logout());
    
    // Opcional: Forzar un refresco de la página para limpiar todo
    // window.location.href = '/login';
  }
  
  return result;
};


export const dummyjsonApi = createApi({
  reducerPath: "dummyjsonApi",

  baseQuery: baseQueryWithAuth,
  tagTypes: ["Posts", "Users"],
  endpoints: (build) => ({
  
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => {
        console.log("📤 Enviando credenciales al login:", body);
        return { url: "/auth/login", method: "POST", body };
      },
      transformResponse: (response: LoginResponse) => {
        console.log("📦 Respuesta recibida del login:", response);
        return response;
      },
    }),

    me: build.query<User, void>({ query: () => "/auth/me" }),

  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  // useGetUsersQuery,
  // useGetPostsQuery,
  // useSearchPostsQuery,
  // useAddPostMutation,
  // useUpdatePostMutation,
  // useDeletePostMutation,
} = dummyjsonApi;