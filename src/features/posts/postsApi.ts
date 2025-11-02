import { dummyjsonApi } from '../../api/dummyjsonApi';
import type { Post } from '../../utils/types'; // Asegúrate de que 'Post' esté definido en tus tipos

// Definimos la respuesta para la lista de posts
interface GetPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

// Definimos la respuesta para la búsqueda de posts
interface SearchPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export const postsApi = dummyjsonApi.injectEndpoints({
  endpoints: (build) => ({
    
    // 1. GET (Todos los posts)
    getPosts: build.query<GetPostsResponse, { limit: number; skip: number }>({
      query: ({ limit, skip }) => `/posts?limit=${limit}&skip=${skip}`,
      // Tipado explícito para 'result'
      providesTags: (result: GetPostsResponse | undefined) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),

    // 2. GET (Buscar posts)
    searchPosts: build.query<SearchPostsResponse, string>({
      query: (q) => `/posts/search?q=${encodeURIComponent(q)}`,
      // Tipado explícito para 'result'
      providesTags: (result: SearchPostsResponse | undefined) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'SEARCH_LIST' }, 
            ]
          : [{ type: 'Posts', id: 'SEARCH_LIST' }],
    }),

    // 3. POST (Crear un post)
    addPost: build.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/posts/add',
        method: 'POST',
        body,
      }),
      // Esta función no usa parámetros, así que el tipado no es necesario
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),

    // 4. PUT (Actualizar un post)
    updatePost: build.mutation<Post, Partial<Post> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      // Tipado explícito para 'result' y 'arg'
      invalidatesTags: (result: Post | undefined, error: any, arg: { id: number }) => [
        { type: 'Posts', id: arg.id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),

    // 5. DELETE (Borrar un post)
    deletePost: build.mutation<{ isDeleted: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      // Tipado explícito para 'result' e 'id'
      invalidatesTags: (result: { isDeleted: boolean; id: number } | undefined, error: any, id: number) => [
        { type: 'Posts', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
  }),
});

// Exportamos los hooks de esta "rama"
export const {
  useGetPostsQuery,
  useSearchPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;