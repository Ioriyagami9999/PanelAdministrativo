import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import type { Post, LoginRequest, LoginResponse, User } from "../utils/types";

import { logout } from "../features/auth/authSlice";


const baseQuery = fetchBaseQuery({
  baseUrl: "https://dummyjson.com",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});


const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);


  if (result.error && (result.error as FetchBaseQueryError).status === 401) {

    api.dispatch(logout());
    

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
        console.log(" Enviando credenciales al login:", body);
        return { url: "/auth/login", method: "POST", body };
      },
      transformResponse: (response: LoginResponse) => {
        console.log(" Respuesta recibida del login:", response);
        return response;
      },
    }),

    me: build.query<User, void>({ query: () => "/auth/me" }),

  }),
});

export const {
  useLoginMutation,
  useMeQuery,

} = dummyjsonApi;