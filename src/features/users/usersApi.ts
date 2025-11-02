import { dummyjsonApi } from '../../api/dummyjsonApi';
import type { User } from '../../utils/types';


interface GetUsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export const usersApi = dummyjsonApi.injectEndpoints({

  endpoints: (build) => ({
    
    // 1. GET (Todos los usuarios) - Leer
    getUsers: build.query<GetUsersResponse, { limit?: number; skip?: number }>({
      query: ({ limit = 30, skip = 0 }) => `/users?limit=${limit}&skip=${skip}`,
      // Proporciona 'Tags'. Si algo "invalida" 'Users', 
      // esta query se volverá a ejecutar automáticamente.
      
      // --- CORREGIDO (se eliminó el '_') ---
      providesTags: (result) => 
        result
          ? [
              ...result.users.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    // 2. GET (Un solo usuario) - Leer
    getUserById: build.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // 3. POST (Crear un usuario) - Crear
    createUser: build.mutation<User, Omit<User, 'id'>>({
      query: (newUser) => ({
        url: '/users/add',
        method: 'POST',
        body: newUser,
      }),
      // Invalida la lista de 'Users'. Esto hará que 'getUsers'
      // se vuelva a ejecutar para obtener la lista actualizada.
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    // 4. PUT/PATCH (Actualizar un usuario) - Actualizar
    updateUser: build.mutation<User, Partial<User> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT', // DummyJSON prefiere PUT para actualizar
        body: patch,
      }),
      // Invalida tanto la 'LISTA' como el 'ID' específico
      invalidatesTags: (result, error, arg) => [
        { type: 'Users', id: arg.id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // 5. DELETE (Borrar un usuario) - Borrar
    deleteUser: build.mutation<{ isDeleted: boolean; id: number }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      // Invalida tanto la 'LISTA' como el 'ID' específico
      invalidatesTags: (result, error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

  }),
});


export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;