// src/pages/fetchPosts.test.tsx

import { screen } from '@testing-library/react'
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { renderWithProviders } from '../test/test-utils'
import FetchPost from './fetchPosts' // Importamos el componente
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// --- 1. Definimos los Mocks de API ---

// Mock para /auth/me (basado en tus handlers existentes)
const mockMeResponse = {
  id: 1,
  username: 'testuser',
  email: 'test@test.com',
  firstName: 'Test',
  lastName: 'User',
  image: '',
  gender: 'male',
}

const mockPostsResponse = {
  posts: [
    { id: 1, title: 'Mock Post Title 1', body: 'Cuerpo del post 1...', userId: 1, tags: ['test'], reactions: 5 },
    { id: 2, title: 'Mock Post Title 2', body: 'Cuerpo del post 2...', userId: 1, tags: ['mock'], reactions: 10 },
  ],
  total: 2,
  skip: 0,
  limit: 10,
}

export const handlers = [
  http.get('https://dummyjson.com/auth/me', () => {
    return HttpResponse.json(mockMeResponse)
  }),
  
  http.get('https://dummyjson.com/posts', () => {
    return HttpResponse.json(mockPostsResponse)
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe('Prueba de FetchPost Page', () => {

  it('debería mostrar el spinner y luego cargar los posts', async () => {
    renderWithProviders(<FetchPost />)

    expect(screen.getByRole('progressbar')).toBeTruthy()

    const postTitle1 = await screen.findByText('Mock Post Title 1')
    const postTitle2 = await screen.findByText('Mock Post Title 2')
    
    expect(postTitle1).toBeTruthy()
    expect(postTitle2).toBeTruthy()

    expect(screen.queryByRole('progressbar')).toBeNull()
  })
  
})