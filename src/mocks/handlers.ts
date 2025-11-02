import { http, HttpResponse } from 'msw'

const baseUrl = 'https://dummyjson.com'

const mockLoginResponse = {
  id: 1,
  username: 'kminchelle',
  email: 'kminchelle@example.com',
  firstName: 'Test',
  lastName: 'User',
  token: 'fake-jwt-token-123',
  accessToken: 'fake-access-token-123',
  image: '',
  gender: 'male',
}

export const handlers = [
  

  http.post(`${baseUrl}/auth/login`, () => {
    return HttpResponse.json(mockLoginResponse)
  }),

  http.get(`${baseUrl}/auth/me`, () => {
    return HttpResponse.json(mockLoginResponse)
  }),
  
   http.get(`${baseUrl}/users`, () => {
    return HttpResponse.json({
      users: [
        { id: 1, firstName: 'Alice', lastName: 'Test' },
        { id: 2, firstName: 'Bob', lastName: 'Mock' },
      ],
      total: 2, skip: 0, limit: 30,
    })
  }),

  http.get(`${baseUrl}/posts`, ({ request }) => {
  
    return HttpResponse.json({
      posts: [
        { id: 1, title: 'Mock Post Title 1', body: 'Cuerpo del post 1...', userId: 1, tags: ['test'], reactions: 5 },
        { id: 2, title: 'Mock Post Title 2', body: 'Cuerpo del post 2...', userId: 1, tags: ['mock'], reactions: 10 },
      ],
      total: 2,
      skip: 0,
      limit: 10,
    })
  }),
]