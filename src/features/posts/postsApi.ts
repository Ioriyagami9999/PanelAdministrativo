import { dummyjsonApi } from '../../api/dummyjsonApi';
import type { Post } from '../../utils/types';


interface GetPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}


interface SearchPostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export const postsApi = dummyjsonApi.injectEndpoints({
  endpoints: (build) => ({
    
    
    getPosts: build.query<GetPostsResponse, { limit: number; skip: number }>({
      query: ({ limit, skip }) => `/posts?limit=${limit}&skip=${skip}`,
  
      providesTags: (result: GetPostsResponse | undefined) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),


    searchPosts: build.query<SearchPostsResponse, string>({
      query: (q) => `/posts/search?q=${encodeURIComponent(q)}`,

      providesTags: (result: SearchPostsResponse | undefined) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Posts' as const, id })),
              { type: 'Posts', id: 'SEARCH_LIST' }, 
            ]
          : [{ type: 'Posts', id: 'SEARCH_LIST' }],
    }),

 
    addPost: build.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/posts/add',
        method: 'POST',
        body,
      }),
 
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),

 
    updatePost: build.mutation<Post, Partial<Post> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
 
      invalidatesTags: (result: Post | undefined, error: any, arg: { id: number }) => [
        { type: 'Posts', id: arg.id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),

 
    deletePost: build.mutation<{ isDeleted: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
   
      invalidatesTags: (result: { isDeleted: boolean; id: number } | undefined, error: any, id: number) => [
        { type: 'Posts', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
  }),
});


export const {
  useGetPostsQuery,
  useSearchPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;