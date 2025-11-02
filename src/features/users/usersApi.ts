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
    
   
    getUsers: build.query<GetUsersResponse, { limit?: number; skip?: number }>({
      query: ({ limit = 30, skip = 0 }) => `/users?limit=${limit}&skip=${skip}`,
 
      providesTags: (result) => 
        result
          ? [
              ...result.users.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),


    getUserById: build.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),


    createUser: build.mutation<User, Omit<User, 'id'>>({
      query: (newUser) => ({
        url: '/users/add',
        method: 'POST',
        body: newUser,
      }),

      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),


    updateUser: build.mutation<User, Partial<User> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT', 
        body: patch,
      }),

      invalidatesTags: (result, error, arg) => [
        { type: 'Users', id: arg.id },
        { type: 'Users', id: 'LIST' },
      ],
    }),


    deleteUser: build.mutation<{ isDeleted: boolean; id: number }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),

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