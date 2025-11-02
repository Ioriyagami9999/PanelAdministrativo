import { http, HttpResponse } from 'msw'

// --- ✅ ¡ESTA ES LA URL QUE TU CÓDIGO LLAMA! ---
// Esta debe ser la misma que en 'dummyjsonApi.ts'
const baseUrl = 'https://dummyjson.com'

// Esta es la respuesta falsa que tu PÁGINA recibirá
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
  
  // --- ✅ AHORA SÍ INTERCEPTA EL ENDPOINT CORRECTO ---
  // (El endpoint al que tu código realmente llama)
  http.post(`${baseUrl}/auth/login`, () => {
    return HttpResponse.json(mockLoginResponse)
  }),

  // (Aquí tus otros mocks, como 'getUsers', 'getPosts', 'me')
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
]