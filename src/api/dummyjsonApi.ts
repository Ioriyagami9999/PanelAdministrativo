import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import type { Post, LoginRequest, LoginResponse, User } from "../utils/types";

export const dummyjsonApi = createApi({
  reducerPath: "dummyjsonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Posts", "Users"],
  endpoints: (build) => ({
    // ✅ Aquí agregamos el console.log dentro del login
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

    getUsers: build.query<{ users: User[] }, { limit?: number }>({
      query: ({ limit = 100 }) => `/users?limit=${limit}`,
      providesTags: ["Users"],
    }),

    getPosts: build.query<
      { posts: Post[]; total: number; skip: number; limit: number },
      { limit: number; skip: number }
    >({
      query: ({ limit, skip }) => `/posts?limit=${limit}&skip=${skip}`,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({
                type: "Posts" as const,
                id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    searchPosts: build.query<{ posts: Post[] }, string>({
      query: (q) => `/posts/search?q=${encodeURIComponent(q)}`,
    }),

    addPost: build.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: "/posts/add",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),

    updatePost: build.mutation<Post, Partial<Post> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (res, err, arg) => [{ type: "Posts", id: arg.id }],
    }),

    deletePost: build.mutation<{ id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [{ type: "Posts", id }],
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useGetUsersQuery,
  useGetPostsQuery,
  useSearchPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = dummyjsonApi;
